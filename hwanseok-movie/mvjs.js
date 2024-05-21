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
/**
 * @description API 연동 
 */
   function favorClicked(){
     const movies = document.querySelector(".movies");
     movies.classList.toggle("hide"); 
     console.log("아이조아");
     const favBtn = document.querySelector(".btn");
    favBtn.classList.add("favorite");
     const remove = document.querySelector(".favorite");
     remove.innerText="remove";
    } 
    
///러브잇 버튼을 누르면 클릭했던 영화 모든 정보를 가져와서 저장할수있게끔 해야함
//저장을 한다치고 그 저장한값을 즐겨찾기 버튼을 눌렀을때 뿌려줘야함
const starClicked = (event) => {
  const btn = event.target;
  const parentDiv = btn.closest('.mvContent');//window 안에 객체를 찾을때까지 돌려짐
  const favor = document.querySelector(".favorites");
  const clone = parentDiv.cloneNode(true); //cloneNode를 사용하여 위에 컨텐츠를 복사 
  const storageTest = this.state.searchResult;
  console.log(this.state.index);
  console.log(storageTest[this.state.index]);
 
  //같은 영화가  중복적으로 들어가는걸 막아야함
  favor.appendChild(clone); // 이부분에 '만약 즐겨찾기 안에 없다면 insert 시켜주고 있다면 알럿 발생'
  // if(즐겨찾기안에 같은게 없다면){
  //   favor.appendChild(clone);
  // }else{
    // alert("이미 등록한 영화 입니다.");
  //   return false;}
  localStorage.setItem("favorites", clone); // storage에 string 형태로 넣어주고 값을 불러올때는 getitem 으로 parse 해서 가져와야함
  
}


/**
 * @description 디브 자동 생성 함수
 */
function createMvDiv(){

  console.log("start create");

  for(const [index, data] of Object.entries(this.state.searchResult)){
    //mvcontent div영역
    debugger;
    this.state.index = index.target; 
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
    btn.onclick=starClicked;

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
          console.log('에러 원인 : ' + error);
          const err = document.createElement('p');
          err.className = 'errMsg';
          err.innerText = '검색 결과가 없습니다.';
          document.querySelector('.movies').appendChild(err);
          }
        finally{this.state.isProcessing=false;}
      }
       scrollFetch(); 
    }
  };




  
  
 
  
    

 
  //데이터 가져오는 api
  // const searchBtn = document.getElementById("searchBtn");
  
  // searchBtn.addEventListener("click", function (e) {
  //   try {
  //     e.preventDefault();
  //     const s = document.getElementById("searchKey").value;
  //     const url = `https://www.omdbapi.com/?i=tt3896198&apikey=9172b236&s=${s}`;
  //     fetch(url)
  //       .then((response) => {
  //         debugger;
  //         console.log("response", "body" in response, "json" in response, "text" in response);
  //         return response.body();
  //       })
  //       .then((json) => {
  //         debugger;
  //         console.log("json", json);
  //       });
  //     console.log("json:", json);
  //   } catch (error) {
  //     console.error(error);
  //   }
  // });
  
  // searchBtn.addEventListener("click", function(){
  //     debugger;
  //     const http = new XMLHttpRequest();
  //     const s = document.getElementById("searchKey").value;
  //     const url = `https://www.omdbapi.com/?i=tt3896198&apikey=9172b236&s=${s}`;
  //     http.open("GET",url);
  //     http.send();
  //     http.onreadystatechange= function(){
  //             debugger;
  //             const result = JSON.parse(http.response);
  //             console.log(typeof result);
  //             // var json = JSON.stringify(result);
  //             // const movieDiv = document.createElement("div");
  //             // const movieSpan = movieDiv.appendChild("span");
  //             // const moviePtag = movieSpan.appendChild("p");
  //             for(const data of result){
  //                 debugger;
  //                 console.log(data);
  //             }
  //             // console.log(json.search["title"]);
  //             console.log(result);
  //             return result;
  //     }
  // });
  
