import { type IUser, EmploymentMode } from '../models/User.js';
import type { ILoan } from '../models/Loan.js';

export interface BREResult {
  approved: boolean;
  reason?: string;
}

/**
 * Business Rule Engine for evaluating Loan Applications.
 * Time Complexity: O(1) - All checks are constant time operations string parsing and math.
 * Space Complexity: O(1) - Minimal memory used for calculations.
 */
export class BusinessRuleEngine {
  private calculateAge(dob: Date): number {
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const m = today.getMonth() - dob.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
      age--;
    }
    return age;
  }

  private getSurnameFirstLetter(name: string): string {
    const parts = name.trim().split(/\s+/);
    // If the user only has a single name, the IT Dept mandates it functions as the surname.
    // Consequently, the 5th letter of the PAN will be the first letter of this single name.
    const surname = parts.length > 1 ? parts[parts.length - 1] : parts[0];
    return surname?.charAt(0).toUpperCase() || "";
  }

  public evaluateLoan(user: IUser, loan: ILoan): BREResult {
    // 1. Check Employment Mode
    if (user.employmentMode === EmploymentMode.UNEMPLOYED) {
      return { approved: false, reason: 'User is unemployed' };
    }

    // 2. Check Salary
    if (!user.salary || user.salary < 25000) {
      return { approved: false, reason: 'Salary is below the minimum requirement of 25000' };
    }

    // 3. Check Age
    if (!user.dob) {
      return { approved: false, reason: 'Date of birth is required' };
    }
    const age = this.calculateAge(new Date(user.dob));
    if (age < 23 || age > 50) {
      return { approved: false, reason: `Age ${age} is not between 23 and 50` };
    }

    // 4. Check PAN Format
    if (!user.pan) {
      return { approved: false, reason: 'PAN card is required' };
    }
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    if (!panRegex.test(user.pan)) {
      return { approved: false, reason: 'Invalid PAN card format' };
    }

    // 5. Check PAN 5th Letter against Surname
    const expectedFifthLetter = this.getSurnameFirstLetter(user.name);
    const actualFifthLetter = user.pan.charAt(4).toUpperCase();
    
    if (expectedFifthLetter !== actualFifthLetter) {
      return { 
        approved: false, 
        reason: `PAN 5th letter (${actualFifthLetter}) does not match surname initial (${expectedFifthLetter})` 
      };
    }

    // If all rules pass
    return { approved: true };
  }
}
