import { Injectable } from '@angular/core';

@Injectable()
export class ValidateService {

  constructor() { }

  validateRegister(user) {
    if (user.name == (false || undefined || "") || user.email == (false || undefined || "") || user.username == (false || undefined || "") || user.password == (false || undefined || "") || user.phone == (false || undefined || "")) {
      return false;
    } else {
      return true;
    }
  }

  validateEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  }

  validatePhone(phone) {
    const re = /^[0-9]{0,40}$/;
    return re.test(phone);
  }

  validateTime(time) {
    const re = /\b((1[0-2]|0?[1-9]):([0-5][0-9]) ([AaPp][Mm]))/;
    return re.test(time);
  }

  validateAlphaNumeric(input) {
    if (typeof input == 'undefined') {
      return false;
    }
    const re = /^[a-zA-Z0-9_',\-#\/ ]*$/;
    return re.test(input.trim()) && (input.trim().length > 0);
  }
}
