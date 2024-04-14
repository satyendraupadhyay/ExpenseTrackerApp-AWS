const form = document.getElementById('user-form');
const password1Input = document.getElementById('password1');

function resetPassword(e){
    e.preventDefault();
    const user = {
        password: password1Input.value,
        link: window.location.href
    };
    axios.post(`/password/reset-password`, user)
    .then((res) => {
        const msg = res.data.msg;
        console.log(msg);
        password1Input.value = '';
    })
    .catch((err) => {
        const msg = err.response.data.msg ? err.response.data.msg : 'Something went wrong :(';
        console.log(msg);
    });
}

form.addEventListener('submit', resetPassword);