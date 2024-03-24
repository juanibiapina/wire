const setupCounter = (element: HTMLButtonElement) => {
  let counter = 0
  const setCounter = (count: number) => {
    counter = count
    element.innerHTML = `count is ${counter}`
  }
  element.addEventListener('click', () => setCounter(counter + 1))
  setCounter(0)
}

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div>
    <button id="counter" type="button"></button>
  </div>
`

setupCounter(document.querySelector<HTMLButtonElement>('#counter')!)
