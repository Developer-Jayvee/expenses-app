import type { UserInterface } from "@c/types/login-types";
import { LocalStorageClass } from "@c/utils/localStorage.util";

export default class AuthService {
  private static storageUserName = "user-info";

  static setUserDetails(user: UserInterface | null): void | null {
    if (!user) return user;
    localStorage.clear();
    localStorage.setItem(this.storageUserName, JSON.stringify(user));
  }
  static getUserData(): UserInterface | null {
    const data = localStorage.getItem(this.storageUserName);
    if (!data) return null;
    return JSON.parse(data);
  }
  static logoutUser(): void {
    LocalStorageClass.clearStorage();
  }
}
