import type { UserInterface } from "@c/types/login-types";

class LoginServiceClass {
  private user;
  private userName = "user-info";
  constructor(user: UserInterface | null) {
    this.user = user;
  }
  storeUserDetails(): UserInterface | null {
    localStorage.setItem(this.userName, JSON.stringify(this.user));
    return this.user;
  }
  getUserDetails(): UserInterface | null {
    let userInfo = localStorage.getItem(this.userName);

    if (!userInfo) {
      return this.storeUserDetails();
    }
    return JSON.parse(userInfo) as UserInterface;
  }
  setUserDetails(user: UserInterface | null = null): void {
    this.user = user;
    this.storeUserDetails();
  }
  clearStorage() {
    if (localStorage.getItem(this.userName)) {
      localStorage.clear();
    }
  }
}

export default function LoginService({ user }: { user: UserInterface | null }) {
  const userClass = new LoginServiceClass(user);

  const getUserDetails = () => userClass.getUserDetails();
  const setUserDetails = (user: UserInterface | null = null) =>
    userClass.setUserDetails(user);
  const clearStorage = () => userClass.clearStorage();
  return {
    getUserDetails,
    setUserDetails,
    clearStorage,
  };
}
