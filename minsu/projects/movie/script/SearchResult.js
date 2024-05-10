/**
 * @description 검색결과 목록
 * @param initialState result, totalCount, isLoading
 * @param onScrollEnded
 */

export default function SearchResult({initialState, onScrollEnded}){
  
  const $result = document.getElementById('result')
  const $loading = document.getElementById('loading')
  const $endLabel = document.getElementById('endLabel')

  let resultListChild = null

  this.state = initialState

  this.setState = nextState => {
    console.log(nextState)
    this.state = nextState
    this.render()
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if(entry.isIntersecting && !this.state.isLoading){
        if(this.state.totalCount > this.state.result.length){
          onScrollEnded()
        }
      }
    })
  }, {
    
    threshold: 0.5
  })

  this.render = () => {

    if(this.state.totalCount > 0 && this.state.isLoading){
      $loading.innerText = 'Loading...'
    }else{
      $loading.innerText = ''
    }

    if(this.state.totalCount > 0 && 
      this.state.result.length === this.state.totalCount){
      $endLabel.innerHTML = '마지막 데이터 입니다.'
    }

    if(this.state.totalCount === 0 && !this.state.isLoading){
      $result.style.display = 'block'
      $result.innerHTML = `검색 결과가 없습니다.`
      return false
    }

    $result.style.display = 'grid'
    $result.innerHTML = `
      ${this.state.result.map(({Title, Year, imdbID, Type, Poster}) => `
        <section style="width: 100%; height: 100%; align-content: center;">
          ${Poster === 'N/A' ? 
            `<div style="width: 40rem; height: 40rem; align-content: center; margin-left: auto; margin-right: auto; background: #2d2d2d;">
              Image not found
            </div>` : 
            `<img src=${Poster} style="width: 40rem; height: 40rem; object-fit:contain; background: #2d2d2d;"  />`
          }
          <div>${Title}(${Year})</div>
          <div>${Type}</div>
        </section>
      `).join('')}
    `
    
    

    const resultNextChild = $result.lastElementChild
  
    if(resultNextChild !== null){
      if(resultListChild !== null){
        observer.unobserve(resultListChild)
      }
  
      resultListChild = resultNextChild
      observer.observe(resultListChild)
    }

  }

  this.render()
}