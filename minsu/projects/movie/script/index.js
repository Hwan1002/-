import {fetchData} from './api.js'
import {setItem, getItem, removeItem} from './storage.js'
import TapButton from './TabButton.js'
import SearchResult from './SearchResult.js'
import SearchHandler from './SearchHandler.js'

function Movie () {
  this.state = {
    tabButton: 'search',
    inputValue: '',
    result: [],
    page: 1,
    totalCount: getItem('totalCount', 0),
    favorites: getItem('favorites', [])
  }

  this.setState = nextState => {
    this.state = nextState
  }

  new TapButton({
    initialState: this.state.tabButton, 
    onClick: (tagName) => {
      const { result, favorites } = this.state
      const searchList = tagName === 'search' ? result : favorites

      this.setState({
        ...this.state,
        tabButton: tagName
      })

      searchResult.setState({
        ...searchResult.state,
        result: searchList,
        tabButton: tagName
      })

    }
  })

  const searchResult = new SearchResult({
    initialState: {
      result: this.state.result,
      totalCount: this.state.totalCount,
      tabButton: this.state.tabButton,
      isLoading: false
    },
    onScrollEnded: () => {
      fetchData(this, searchResult)
    },
    onFavoriteClick: (imdbID) => {
      const {result, favorites, tabButton} = this.state

      const resultIndex = result.findIndex(movie => movie.imdbID === imdbID)
      const favoriteIndex = favorites.findIndex(movie => movie.imdbID === imdbID)

      let saveResult;
      if (favoriteIndex >= 0) {
        saveResult = favorites.filter(movie => movie.imdbID !== imdbID);
      } else {
        const updatedMovie = { ...result[resultIndex], favorite: !result[resultIndex].favorite };
        saveResult = [...favorites, updatedMovie];
      }

      setItem('favorites', saveResult)
      setItem('totalCount', saveResult.length)

      const nextResult = [...result]
      if(result.length > 0) nextResult[resultIndex].favorite = !result[resultIndex].favorite

      this.setState({
        ...this.state,
        result: nextResult,
        favorites: saveResult,
      })

      searchResult.setState({
        ...searchResult.state,
        result: tabButton === 'search' ? nextResult : saveResult
      })
    },
    tabButton: this.state.tabButton
  })

  new SearchHandler({
    setState: () =>{
      this.setState({
        ...this.state,
        page: 1,
        inputValue: document.getElementById('inputValue').value
      })
    },
    resultSetState: () => {
      searchResult.setState({
        ...searchResult.state,
        isLoading: true,
      })
    },
    fetchData: () => {
      fetchData(this, searchResult, true)
    }
  })

}

new Movie()