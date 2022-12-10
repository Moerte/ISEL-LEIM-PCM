class UserController {
    constructor(formId, formIdUpdate, tableId) {
        this.createAdmin();
        this.formElmId = document.getElementById(formId);
        this.tableId = document.getElementById(tableId);
        this.formUpdateEl = document.getElementById(formIdUpdate);
        this.onSubmit();
        this.onEdit();
        this.selectAll();
        this.isAdmin = false;
        this.sidebarMngmt();
        this.checkCookie();
        this.onLogin();
        this.onLogout();
        this.resetPassword();
    }

    setCookie(cname, cvalue, exdays) {
        let d = new Date();
        d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
        let expires = "expires=" + d.toGMTString();
        document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
    }

    getCookie(cname) {
        let name = cname + "=";
        let decodedCookie = decodeURIComponent(document.cookie);
        let ca = decodedCookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
            }
        }
        return "";
    }

    checkCookie() {
        let user = this.getCookie("username");
        if (user != "") {
            let users = User.getUsersStorage();
            let userRegister;
            let photo, isAdmin;
            users.forEach((userData) => {
                if (userData._name == user) {
                    userRegister = userData._register;
                    photo = userData._photo;
                    isAdmin = userData._admin ? true : false;
                }
            });
            this.setProfile(user, userRegister, photo, isAdmin);
        }
    }

    deleteCookie(name) {
        this.setCookie(name, this.getCookie("username"), 0.00001);
    }

    createAdmin() {
        let storage = User.getUsersStorage();
        if (storage.length < 1) {
            let userAdmin = new User("Admin", "M", null, null, "admin@usernow.pt", btoa("12345"), "img/boxed-bg.jpg", true);
            userAdmin.save();
        }
    }

    onLogin() {
        document.querySelector("#submit-login").addEventListener("click", e => {
            let users = User.getUsersStorage();
            let testBool = false;
            let username = document.querySelector("#logText").value;
            let pass = document.querySelector("#logPass").value;
            let user = "User";
            let userRegister = "now";
            let photo, isAdmin;
            users.forEach((userData) => {
                if (username == userData._name && pass == atob(userData._password)) {
                    testBool = true;
                    user = userData._name;
                    userRegister = userData._register;
                    photo = userData._photo;
                    isAdmin = userData._admin ? true : false;
                }
            });
            if (testBool) {
                this.setProfile(user, userRegister, photo, isAdmin);
                this.setCookie('username', user, 0.5);
                document.querySelector(".form-login").reset();
            } else {
                document.querySelector(".with-error").style.display = "block";
            }
        });
    }

    onLogout() {
        document.querySelector("#logout-btn").addEventListener("click", e => {
            if (confirm("Are you sure you to log out?")) {
                this.deleteCookie("username");
                document.querySelector(".main").style.display = "block";
                document.querySelector(".wrapper").style.display = "none";
            }
        })
    }

    onEdit() {
        document.querySelector("#box-user-update .btn-cancel").addEventListener("click", e => {
            e.preventDefault();
            this.formUpdateEl.reset();
            document.querySelector("#update-form").style.display = "none";
        });
        this.formUpdateEl.addEventListener("submit", e => {
            e.preventDefault();
            let btn = this.formUpdateEl.querySelector("[type=submit]");
            btn.disabled = true;
            let values = this.getValues(this.formUpdateEl);
            let index = this.formUpdateEl.dataset.trIndex;
            let tr = this.tableId.rows[index];
            let userOld = JSON.parse(tr.dataset.user);
            let result = Object.assign({}, userOld, values);
            this.getPhoto(this.formUpdateEl).then((content) => {
                if (!values.photo) result._photo = userOld._photo;
                else result._photo = content;
                let user = new User();
                user.loadFromJSON(result);
                user.save();
                this.getTr(user, tr);
                this.updateCount();
                btn.disabled = false;
                this.formUpdateEl.reset();
            }, (e) => {
                console.error(e);
            });
            document.querySelector("#update-form").style.display = "none";
        });
        
    }

    onSubmit() {
        this.formElmId.addEventListener("submit", event => {
            event.preventDefault();
            let btn = this.formElmId.querySelector("[type=submit]");
            btn.disabled = true;
            let values = this.getValues(this.formElmId, true);
            btn.disabled = false;
            if (!values) return false;
            this.getPhoto(this.formElmId).then((content) => {
                values.photo = content;
                values.save();
                this.addLine(values);
                this.formElmId.reset();
                btn.disabled = false;
                this.showPanelList();
            }, (e) => {
                console.error(e);
            }
            );
        });
    }

    sidebarMngmt() {
        document.querySelector("#create-btn").addEventListener("click", e => {
            e.preventDefault();
            document.querySelector("#logDiv").style.display = "none";
            [...this.formElmId.elements].forEach(field => {

                if (['name', "email"].indexOf(field.name) > -1) {
                    field.parentElement.classList.remove('has-error');
                }
            });
            this.showPanelCreate();
        });
        document.querySelector("#list-btn").addEventListener("click", e => {
            this.formElmId.reset();
            this.showPanelList();
        });
    }

    resetPassword() {
        let testBool = false;
        document.querySelector("#forgot-pass").addEventListener("click", e => {
            e.preventDefault();
            document.querySelector(".reset").style.display = "block";
            document.querySelector(".login").style.display = "none";
            document.querySelector("#submit-new-pass").addEventListener("click", e => {
                e.preventDefault();
                let users = User.getUsersStorage();
                let email = document.querySelector("#email-pass").value;
                let newPass = document.querySelector("#new-pass").value;
                let newUser, oldUser;
                users.forEach((userData) => {
                    if (email == userData._email) {
                        oldUser = userData;
                        testBool = true;
                        userData._password = btoa(newPass);
                        newUser = userData;
                    }
                });
                if (testBool) {
                    let result = Object.assign({}, oldUser, newUser);
                    let user = new User();
                    user.loadFromJSON(result);
                    user.save();
                    document.querySelector(".log-new-pass").style.display = "block";
                    document.querySelector(".log-new-pass").innerHTML = "Your new password was submited.";
                    document.querySelector("#cancel-pass").style.display = "none";
                    document.querySelector("#back-pass").style.display = "block";

                } else {
                    document.querySelector(".log-new-pass").style.display = "block";
                    document.querySelector(".log-new-pass").style.color = "red";
                    document.querySelector(".log-new-pass").innerHTML = "This email doesn't exist.";
                }
            });
            document.querySelector("#cancel-pass").addEventListener("click", e => {
                this.showLoginPanel();
            });
            document.querySelector("#back-pass").addEventListener("click", e => {
                this.showLoginPanel();
            });
        });
    }


    getPhoto(formEl) {

        return new Promise((resolve, reject) => {
            let fileReader = new FileReader();
            let elements = [...formEl.elements].filter(item => {
                if (item.name === 'photo') return item;
            });
            let file = elements[0].files[0];
            fileReader.onload = () => {
                resolve(fileReader.result);
            };
            fileReader.onerror = (e) => {
                reject(e);
            }
            if (file) fileReader.readAsDataURL(file);
            else resolve('img/boxed-bg.jpg');
        });
    }

    getValues(formEl, isCreate = false) {
        let user = {};
        let isValid = true;
        let users = User.getUsersStorage();
        [...formEl.elements].forEach(field => {
            if (isCreate) {
                if (['name', "email"].indexOf(field.name) > -1) {
                    let bool = false;
                    users.find(item => {
                        switch (field.name) {
                            case "name":
                                if (item._name === field.value) {
                                    bool = true;
                                }
                                break;
                            case "email":
                                if (item._email === field.value) {
                                    bool = true;
                                }
                                break;
                        }
                    });
                    if (bool) {
                        document.querySelector("#logDiv").style.display = "block";
                        field.parentElement.classList.add('has-error');
                        isValid = false;
                    }
                }
            }

            if (['name', 'email', 'password'].indexOf(field.name) > -1 && !field.value) {
                field.parentElement.classList.add('has-error');
                isValid = false;
            }
            if (field.name == "gender") {
                if (field.checked) {
                    user[field.name] = field.value;
                }
            } else if (field.name == 'admin') {
                user[field.name] = field.checked;
            } else if (field.name == 'password') {
                user[field.name] = btoa(field.value);
            } else {
                user[field.name] = field.value;
            }
        });
        if (!isValid) return false;
        return new User(user.name, user.gender, user.birth, user.country, user.email, user.password, user.photo, user.admin);
    }

    selectAll() {
        let users = User.getUsersStorage();
        users.forEach(dataUser => {
            let user = new User();
            user.loadFromJSON(dataUser);
            this.addLine(user);
        })
    }

    setProfile(user, date, photo, isAdmin) {
        this.isAdmin = isAdmin;
        document.querySelector(".main").style.display = "none";
        document.querySelector(".wrapper").style.display = "block";
        document.querySelector("#username-sidebar p").innerHTML = user;
        let imgProfile = document.querySelectorAll(".img-profile");
        imgProfile.forEach(img => {
            img.src = photo;
        })
        document.querySelector("#profile-name").innerHTML = user;
        document.querySelector("#user-header p").innerHTML = user + "<small>Member since " + Utils.getYear(new Date(date)) + "</small>";
        if (isAdmin) {
            this.setPrivilege("block");
        } else {
            this.setPrivilege("none");
        }
    }

    setPrivilege(value) {
        let list = document.querySelector("#user-list");
        let colRemove = value == "none" ? "col-md-8" : "col-md-12";
        let colAdd = value == "none" ? "col-md-12" : "col-md-8";
        list.classList.remove(colRemove);
        list.classList.add(colAdd);
        let deleteBtn = document.querySelectorAll(".btn-delete");
        deleteBtn.forEach(btn => {
            btn.style.display = value == "none" ? "none" : "inline-block";
        })
        let editBtn = document.querySelectorAll(".btn-edit");
        editBtn.forEach(btn => {
            btn.style.display = value == "none" ? "none" : "inline-block";
        })
        document.querySelector("#create-btn").style.display = value;
        document.querySelector("#box-user-update").style.display = value;
    }

    addLine(dataUser) {
        let tr = this.getTr(dataUser);
        this.tableId.appendChild(tr);
        this.updateCount();
    }

    getTr(dataUser, tr = null) {
        if (tr === null) tr = document.createElement("tr");
        tr.dataset.user = JSON.stringify(dataUser);
        tr.innerHTML = `
            <td><img src="${dataUser.photo}" alt="User Image" class="img-circle img-sm"></td>
            <td>${dataUser.name}</td>
            <td>${dataUser.email}</td>
            <td>${(dataUser.admin) ? 'Yes' : 'No'}</td>
            <td>${Utils.dateFormat(dataUser.register)}</td>
            <td>
                <button type="button" class="btn btn-primary btn-edit btn-xs btn-flat">Edit</button>
                <button type="button" class="btn btn-danger btn-delete btn-xs btn-flat">Delete</button>
            </td>
        `;
        this.addEventsTr(tr);
        return tr;
    }

    addEventsTr(tr) {
        tr.querySelector(".btn-delete").addEventListener("click", e => {
            if (confirm("Are you sure you want to delete the record?")) {
                let user = new User();
                user.loadFromJSON(JSON.parse(tr.dataset.user));
                let loggedUser = this.getCookie("username");
                if (loggedUser != user._name) {
                    user.remove();
                    tr.remove();
                    this.updateCount();
                }else{
                    alert("You cannot delete your own user.");
                }
            }
        });
        tr.querySelector(".btn-edit").addEventListener("click", e => {
            document.querySelector("#update-form").style.display = "block";
            let json = JSON.parse(tr.dataset.user);
            this.formUpdateEl.dataset.trIndex = tr.sectionRowIndex;
            for (let name in json) {
                let field = this.formUpdateEl.querySelector("[name=" + name.replace("_", "") + "]");
                if (field) {
                    switch (field.type) {
                        case 'file':
                            continue;
                        case 'radio':
                            field = this.formUpdateEl.querySelector("[name=" + name.replace("_", "") + "][value=" + json[name] + "]");
                            field.checked = true;
                            break;
                        case 'checkbox':
                            field.checked = json[name];
                            break;
                        default:
                            field.value = json[name];
                    }
                }
            }
            this.formUpdateEl.querySelector(".photo").src = json._photo;
        });
    }

    showPanelCreate() {
        document.querySelector("#box-user-create").style.display = "block";
        document.querySelector("#box-user-update").style.display = "none";
        document.querySelector("#user-list").style.display = "none";
    }

    showPanelList() {
        document.querySelector("#user-list").style.display = "block";
        if (this.isAdmin) document.querySelector("#box-user-update").style.display = "block";

        document.querySelector("#box-user-create").style.display = "none";
    }

    showLoginPanel() {
        document.querySelector(".reset").style.display = "none";
        document.querySelector(".login").style.display = "block";
    }

    updateCount() {
        let numberUsers = 0;
        let numberAdmin = 0;
        [...this.tableId.children].forEach(tr => {
            numberUsers++;
            let user = JSON.parse(tr.dataset.user);
            if (user._admin) numberAdmin++;
        });
        document.querySelector("#number-users").innerHTML = numberUsers;
        document.querySelector("#number-users-admin").innerHTML = numberAdmin;
    }
}