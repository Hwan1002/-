(() => {
    console.log("DOM start script");
    /**
     * @description Element 스타일 핸들러
     * @return {void}
     */
      const initStyle = () => {
      const inputNode = document.querySelector("#searchKey");
    };
  
    /**
     * @description 키보드 눌렀을때(`down`) 엔터키 막기 이벤트 핸들러
     * @param {KeyboardEvent<HTMLInputElement>} e
     * @returns {void}
     */
    const onBlockEnter = (e) => {
      if (e.keyCode === 13 && e.key === "Enter") {
        e.preventDefault();
        onSearch();
      }
    };
    document.addEventListener("keydown", onBlockEnter);
    initStyle();
  })();
  
//현재상태값 저장
this.state = {
  nowPage: 1,
  inputValue: '',
  searchResult: [], //여기로 받아와서 json stringigy 하면 어떨까 
  totalPage : 0,
  isProcessing: false,
  index:0,
}
///////////////////////즐겨찾기 구현 

//즐겨찾기 변수설정
//즐겨찾기에 hide 클래스를 붙혀서 안보이게 설정
const favor = document.querySelector(".favorites");
  favor.classList.add("hide");

//로컬 스토리지 저장함수
 const savedFavorite = (index) => {
  try{
    debugger;
    // if(!localStorage.getItem(key)){
      window.localStorage.setItem("savedFavorite",JSON.stringify(this.state.searchResult[index]));
    // }
  }catch(error){
    console.log("에러 :" + error);
  }
 }
 
//로컬 스토리지 데이터 가져오는 함수 & 뿌려주는 함수
const getFavorite = () => {
  let getData = JSON.parse(localStorage.getItem("savedFavorite")); //getData 변수 안에 가져온 값들을 저장
      const divNodeDummy = document.createElement('div');
    divNodeDummy.classList.add('mvContent');
    const divImgNode = document.createElement('div');
    divImgNode.classList.add('mvImage');
    const imgNode = document.createElement('img');
    imgNode.src=getData['Poster'];
    imgNode.onerror=this.src='img/pic_error.png';
    
    const divTitle = document.createElement('div');
    divTitle.classList.add('mvTitle');
    const spanNode = document.createElement('span');
    const titleP = document.createElement('p');
    titleP.classList.add("title");
    titleP.id="title";
    titleP.innerText=getData["Title"];
    const typeP = document.createElement('p');
    typeP.id="type";
    typeP.innerText=getData["Type"];
    const btn = document.createElement("button");
    btn.classList.add("btn");
    btn.type="button";
    btn.onclick=cancelClicked;

    btn.innerText="CANCEL";

    divTitle.appendChild(spanNode);
    spanNode.appendChild(titleP);
    spanNode.appendChild(typeP);
    spanNode.appendChild(btn);

    // spanNode.appendChild(button);
    divImgNode.appendChild(imgNode);
    divNodeDummy.appendChild(divImgNode);
    divNodeDummy.appendChild(divTitle);

    document.querySelector('.favorites').appendChild(divNodeDummy);
  }

  
const cancelClicked = (event) => {
    window.localStorage.removeItem("savedFavorite");
}  
//메인에 있는 즐겨찾기 버튼을 눌렀을때 로컬스토리지에 저장한값(함수)을 뿌려주는 함수
function favorClicked(){ 
  console.log("즐겨찾기 버튼");
  getFavorite();

  const movies = document.querySelector(".movies");
  //토글로 클릭시 검색했던 결과 값을 안보이게 하고 즐겨찾기 내용들을 보여줌
  movies.classList.toggle("hide");
  favor.classList.toggle("hide");

  } 
    
///LOVE IT! 버튼을 누르면 클릭했던 영화 모든 정보를 가져와서 로컬스토리지에 저장하는 함수
const loveClicked = (event) => {
  const boxs = document.querySelectorAll('.movies > div');
  boxs.forEach((key, index) => {
    key.onclick = () => {
      //같은 영화가  중복적으로 들어가는걸 막아야함

        savedFavorite(index);
        getFavorite();
        // const clone = el.cloneNode(true); 
        //cloneNode를 사용하여 위에 컨텐츠를 복사 
        // favor.appendChild(clone);
      
      
      // favor.appendChild(clone);
     // storage에 string 형태로 넣어주고 값을 불러올때는 getitem 으로 parse 해서 가져와야함
      
    }
  })
}


/**
 * @description 디브 자동 생성 함수
 */
function createMvDiv(){

  console.log("start create");

  for(const [index, data] of Object.entries(this.state.searchResult)){
    //mvcontent div영역
    const divNodeDummy = document.createElement('div');
    divNodeDummy.classList.add('mvContent');
    //위에 안에 있는 mvImage div 영역
    const divImgNode = document.createElement('div');
    divImgNode.classList.add('mvImage');
    
    //img 태그 
    const imgNode = document.createElement('img');
    imgNode.src=data['Poster'];
    imgNode.onerror=this.src='img/pic_error.png';
    
    // imgNode.onerror=this.src='img/pic_error.png';
    //mvTitle 영역
    const divTitle = document.createElement('div');
    divTitle.classList.add('mvTitle');
    const spanNode = document.createElement('span');
    const titleP = document.createElement('p');
    titleP.classList.add("title");
    titleP.id="title";
    titleP.innerText=data["Title"];
    const typeP = document.createElement('p');
    typeP.id="type";
    typeP.innerText=data["Type"];
    const btn = document.createElement("button");
    btn.classList.add("btn");
    btn.type="button";
    btn.onclick=loveClicked;

    btn.innerText="LOVE IT!";
    
    divTitle.appendChild(spanNode);
    spanNode.appendChild(titleP);
    spanNode.appendChild(typeP);
    spanNode.appendChild(btn);

    // spanNode.appendChild(button);
    divImgNode.appendChild(imgNode);
    divNodeDummy.appendChild(divImgNode);
    divNodeDummy.appendChild(divTitle);

    document.querySelector('.movies').appendChild(divNodeDummy);

  }
}
  /**
   * @description 즐겨찾기 버튼 
   */
/**
 * @description api fetch 
 */    

/**
 * @description search 버튼 클릭 이벤트 핸들러.
 */
const onSearch = async () => {
  try { 
      const s = document.getElementById("searchKey").value;
      const url = `https://www.omdbapi.com/?i=tt3896198&apikey=9172b236&s=${s}`;
      const response = await fetch(url);
      const result = await response.json();
      const totalResult = result.totalResults;
      const totalPage = Math.ceil(totalResult/10);

      this.state.inputValue += s;
      this.state.totalPage += totalPage;
      this.state.searchResult = result.Search;
      
      createMvDiv();

  } catch (error) {
      console.log('에러 원인 : ' + error);
      const err = document.createElement('p');
      err.className = 'errMsg';
      err.innerText = '검색 결과가 없습니다.';
      document.querySelector('.movies').appendChild(err);
    }
};

//debounce 사용해서 scroll 마다 실행되는거 막기
//debounce 함수 만들기 
const debounce = (callback, delay = 120) => {
  let timer;
  return (e) => {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      callback(e);
    }, delay);
  };
};
// 스크롤시 무한 스크롤을 하기 위한 함수 정리
window.addEventListener('scroll', debounce(scrollBouce));
  
function scrollBouce(){
  console.log(window.scrollY,window.innerHeight);
  console.log(this.state.isProcessing);

  const isScrollEnded = window.scrollY + window.innerHeight + 100 >= document.body.scrollHeight;

  if (isScrollEnded && !this.state.isProcessing) {

    this.state.isProcessing = true;

    const scrollFetch = async () => {
      try{
            const url = `https://www.omdbapi.com/?i=tt3896198&apikey=9172b236&s=${this.state.inputValue}&page=${this.state.nowPage += 1}`;
            console.log(url);
            const response = await fetch(url);
            const result = await response.json();
            this.state.searchResult = result.Search;
            createMvDiv();
          }
      catch(error){
          console.log('wating to scroll ' + error);
          const err = document.createElement('p');
          err.className = 'errMsg';
          document.querySelector('.movies').appendChild(err);
          }
        finally{this.state.isProcessing=false;}
      }
       scrollFetch(); 
    }
  };




  
  
 
  
    

