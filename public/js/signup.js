const signup = document.getElementById('sign-up');
signup.addEventListener('submit', (event) => {
    event.preventDefault();

    const name = event.target.name.value;
    const email = event.target.email.value;
    const password = event.target.password.value;

    const user = {
        name,
        email,
        password
    }
        axios.post(`/user/signup`, user)
        .then((res) => {
            alert("Signup Success, Now please signin to continue");
            if (res.data.success) {
              window.location.href = '/user/signin';
            }
        })
        .catch((err) => {
            document.body.innerHTML = document.body.innerHTML + "<h4>Something went wrong</h4>"
            console.log(err);
        })
    })

