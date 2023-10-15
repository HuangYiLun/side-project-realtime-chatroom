
//form validation from front-end
const form = document.querySelector('#form')
const submitButton = document.querySelector('#btn-submit')
const nameInput = document.querySelector('#name')
const emailInput = document.querySelector('#email')
const passwordInput = document.querySelector('#password')
const confirmPasswordInput = document.querySelector('#confirmPassword')

submitButton.addEventListener('click', function onSubmitClick() {
  form.classList.add('was-validated')
})

form.addEventListener('submit', function onFormSubmit() {
  if (!form.checkValidity()) {
    event.preventDefault()
    event.stopPropagation()
  }
})

// Name
nameInput.addEventListener('keyup', function countLetters() {
  const target = event.target
  const counter = target.parentElement.lastElementChild
  counter.innerText = `${target.value.length}/20`
})

nameInput.addEventListener('keyup', function onInputKeyUp() {
  if (event.target.value.length > 20) {
    event.target.setCustomValidity("Invalid field.")
  } else {
    event.target.setCustomValidity("")
  }
})

// Password
passwordInput.addEventListener('keyup', function countLetters() {
  const target = event.target
  const counter = target.parentElement.lastElementChild
  counter.innerText = `${target.value.length}/12`
})

// Confirm Password
confirmPasswordInput.addEventListener('keyup', function confirmPassword() {
  const target = event.target

  if (passwordInput.value !== confirmPasswordInput.value) {
    event.target.setCustomValidity("Invalid field.")
  } else {
    event.target.setCustomValidity("")
  }
})