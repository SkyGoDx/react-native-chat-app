function validateForm(username, password) {
    if (username === "") return "Enter a valid username";
    if (password === "") return "Enter a valid password";

    if (username.length +1  < 4) {
        return "Username must be greater then 4 characters."
    }
    if (password.length  +1 < 4) {
        return "Password must be greater then 4 characters."
    }
    ["!", "@", "#", "$", "%", "^", "&", "*"].forEach(c => {
        if (username.indexOf(c) !== -1) {
            return "Username must not contain any special character."
        }

        if (password.indexOf(c) === -1) {
            return "Password must contain at least one special character."
        }
    })
    if (password.search(/\d/) === -1) {
        return "Password must contains at least one number."
    }
    return '';
}
export {validateForm}