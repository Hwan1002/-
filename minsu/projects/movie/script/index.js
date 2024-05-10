import {request} from './api.js'
import TapButton from './TabButton.js'
import SearchResult from './SearchResult.js'
import SearchHandler from './SearchHandler.js'

function Movie () {
  this.state = {
    tabButton: 'search',
    inputValue: '',
    result: [],
    page: 1,
    totalCount: 0,
    isLoading: false
  }

  this.setState = nextState => {
    this.state = nextState
  }

  new TapButton({
    initialState: this.state.tabButton, 
    onClick: (tagName) => {
      this.setState({
        ...this.state,
        tabButton: tagName
      })
    }
  })

  const searchResult = new SearchResult({
    initialState: {
      result: this.state.result,
      totalCount: this.state.totalCount,
      isLoading: false
    },
    onScrollEnded: () => {
      fetchData()
    },
  })

  const $inputValue = document.getElementById('inputValue')

  const fetchData = async(firstPage = false) => {
    
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

  new SearchHandler({
    setState: () =>{
      this.setState({
        ...this.state,
        isLoading: true,
        inputValue: $inputValue.value
      })
    },
    resultSetState: () => {
      searchResult.setState({
        result: this.state.result,
        totalCount: this.state.totalCount,
        isLoading: true,
      })
    },
    fetchData: () => {
      fetchData(true)
    }
  })

}

new Movie()