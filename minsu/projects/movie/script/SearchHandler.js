/**
 * @description 검색 이벤트
 * @param param setState, resultSetState, fetchData
 */
export default function SearchHandler({setState, resultSetState, fetchData}){

  const $inputValue = document.getElementById('inputValue')
  const $inputSearch = document.getElementById('inputSearch')

  $inputSearch.addEventListener('click', () => {
    setState()
    resultSetState()
    fetchData()
  })

  $inputValue.addEventListener('keyup', (e) => {
    if(e.key === 'Enter') {
      setState()
      resultSetState()
      fetchData()
    }
  })
}