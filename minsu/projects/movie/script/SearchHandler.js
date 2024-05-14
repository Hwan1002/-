/**
 * @description 검색 이벤트
 * @param param setState, resultSetState, fetchData
 */
export default function SearchHandler({setState, resultSetState, fetchData}){

  const $inputValue = document.getElementById('inputValue')
  $inputValue.addEventListener('keyup', (e) => {
      setState()
      resultSetState()
      fetchData()
  })
}