import {API_URL} from "./config.js";

export const request = async(search,page) => {
  try{
    const res = await fetch(`${API_URL}&s=${search}&page=${page}`)

    if(!res.ok){
      throw new Error('호출 실패')
    }

    return await res.json()
  }catch(e){
    alert(e.message)
  }
}
const $inputValue = document.getElementById('inputValue')

export default async function FetchData ({firstPage = false}) {
  
  searchResult.setState({
    result: this.state.result,
    totalCount: this.state.totalCount,
    isLoading: true,
  })

  const page = firstPage ? 1 : this.state.page
  const resultData = await request(this.state.inputValue, this.state.page);

  if(resultData.Response === 'True' && 'Search' in resultData){
    if(firstPage) window.scrollTo(0, 0)

    const nextData = page === 1 ? 
      resultData.Search : 
      [...this.state.result, ...resultData.Search]

    this.setState({
      ...this.state,
      isLoading: false,
      result: nextData,
      totalCount: resultData.totalResults,
      page: firstPage ? 1 : this.state.page + 1
    })

    searchResult.setState({
      result: nextData,
      totalCount: resultData.totalResults,
      isLoading: false,
    })
  }else{
    this.setState({
      ...this.state,
      isLoading: false,
      result: [],
      totalCount: 0,
      page: 1
    })

    searchResult.setState({
      result: [],
      totalCount: 0,
      isLoading: false,
    })
  }
}