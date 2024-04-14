const form = document.getElementById('user-form');
const emailInput = document.getElementById('email');

function forgotpassword(e) {
    e.preventDefault();
    const userDetails = {
        email: emailInput.value
    }
    axios.post(`/password/forgotpassword`, userDetails)
    .then(response => {
        if(response.status === 200){
            alert('Mail sent successfully');
            window.location.href = '/user/signin';
        } else {
            throw new Error('Something went wrong!!!')
        }
    }).catch((err) => {
        document.body.innerHTML += `<div style="color:red;">${err} <div>`;
    })
}

form.addEventListener('submit', forgotpassword);