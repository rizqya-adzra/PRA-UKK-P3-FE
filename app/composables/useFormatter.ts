export function useFormatter() {
  const formatDate = (
    isoString: string | undefined, 
    showTime: boolean = true
  ) => {
    if (!isoString) return '-'
    
    const date = new Date(isoString)
    
    if (isNaN(date.getTime())) return '-'

    const options: Intl.DateTimeFormatOptions = {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }

    if (showTime) {
      options.hour = '2-digit'
      options.minute = '2-digit'
    }

    return new Intl.DateTimeFormat('id-ID', options).format(date)
  }

  return {
    formatDate
  }
}