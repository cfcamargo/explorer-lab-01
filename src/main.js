import "./css/index.css"
import IMask from "imask"


const ccBgColor01 = document.querySelector(".cc-bg svg > g g:nth-child(1) path")
const ccBgColor02 = document.querySelector(".cc-bg svg > g g:nth-child(2) path")

const ccLogo = document.querySelector(".cc-logo span:nth-child(2) img")





function setCardType(type) {

  const colors = {
    "visa" : ["#436D99", "#2d57f2"],
    "mastercard" : ["#df6f29", "#c69347"],
    "amex" : ["#64B17C", "#9CD5BA"],
    "default" : ["black", "gray"]
  }
  ccBgColor01.setAttribute("fill", colors[type][0])
  ccBgColor02.setAttribute("fill", colors[type][1])
  ccLogo.setAttribute("src", `cc-${type}.svg`)

}

globalThis.setCardType = setCardType



const securityCode = document.querySelector('#security-code')
const securityCodePattern = {
  mask : "0000"
}
const securityCodeMasked = IMask(securityCode, securityCodePattern)

const expirationDate = document.querySelector('#expiration-date')
const expirationDatePattern = {
  mask : "MM{/}YY",
  blocks: {
    MM:{
      mask : IMask.MaskedRange,
      from : 1,
      to: 12
    },
    YY : {
      mask : IMask.MaskedRange,
      from : String(new Date().getFullYear()).slice(2),
      to: String(new Date().getFullYear() + 10).slice(2)
    }
  }
}
const expirationDateMasked = IMask(expirationDate, expirationDatePattern)

const cardNumber = document.querySelector("#card-number")
const cardNumberPattern = {
  mask : [
    {
      mask: "0000 0000 0000 0000",
      regex: /^4\d{0,15}/, 
      cardType : "visa",
    },
    {
      mask: "0000 0000 0000 0000",
      regex:/(^5[1-5]\d{0,2}|^22[2-9]\d|^2[3-7]\d{0,2})\d{0,12}/,
      cardType : "mastercard", 
    },
    {
      mask: "0000 0000 0000 0000",
      cardType : "default",
    }
  ],
  dispatch : function (appended, dynamicMasked){
    const number = (dynamicMasked.value + appended).replace(/\D/g, "")
    const foundMask = dynamicMasked.compiledMasks.find( function (item) {
      return number.match(item.regex)
    })
    return foundMask
  }
}

const cardNumberMasked = IMask(cardNumber, cardNumberPattern)

const addButton = document.querySelector("#add-card")
addButton.addEventListener("click", function(){
  alert('adicionei')
})

document.querySelector('form').addEventListener("submit", (e) => {
  e.preventDefault()
})

const cardHolder = document.querySelector('#card-holder')
cardHolder.addEventListener("input", () => {
  const ccHolder = document.querySelector(".cc-holder .value")

  ccHolder.innerText = cardHolder.value.length > 3 ? cardHolder.value : 'JHON DOE'
})

securityCodeMasked.on('accept', () => {
  const cardType = cardNumberMasked.masked.currentMask.cardType
  setCardType(cardType)
  updateSecurityCode(securityCodeMasked.value)
})

function updateSecurityCode(code){
  const ccSecurity = document.querySelector(".cc-security .value")

  ccSecurity.innerText = code.length === 0 ? '123' : code 
}

cardNumberMasked.on('accept', () => {
  updateCard(cardNumberMasked.value)
})

function updateCard(number){
  const ccNumber = document.querySelector(".cc-number")
  const defaultNumber = '1234 5678 9012 3456'

  ccNumber.innerText = number.length === 0 ? defaultNumber : number
}


expirationDateMasked.on('accept', () => {
  updateExpirationDate(expirationDateMasked.value)
})

function updateExpirationDate(date){
  const ccExpiration = document.querySelector(".cc-extra .value")
  ccExpiration.innerText = date.length === 0 ? '01/32' : date
}