export const tooltipOptions = {
  callbacks: {
    label: context =>
      `${context.dataset.label}: ${context.parsed.y.toLocaleString('fi-FI', {
        style: 'currency',
        currency: 'EUR'
      })}`
  },
  displayColors: false
}

export const titleOptions = title => ({
  display: true,
  text: title,
  font: {
    size: 25,
    family: 'Roboto, sans-serif'
  }
})