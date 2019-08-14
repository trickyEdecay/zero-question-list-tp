import $ from "jquery";
(()=>{
    // 分页的当前页
    let currentPage = 1;

    console.log('asdadsa');

    // 提交一个新问题的逻辑
    $("#submit-question-form").submit((e)=>{
        e.preventDefault();
        $("#error-text").html("");
        if($("#question-input").val().trim()===""){
            $("#error-text").html("提交的问题不能为空");
            return;
        }
        $.ajax({
            url:  "/zero-question-list-tp/public/index/question/createQuestion",
            type: "post",
            data: {
                question:$("#question-input").val(),
                isAnonymous:$("#is-anonymous").is(":checked")
            },
            success: (response)=>{
                response = JSON.parse(response);
                if(response.code!=="0000"){
                    $("#error-text").html(response.msg);
                    return;
                }
                let question = response.data;
                getQuestionList(currentPage);
                $("#question-input").val("");
                bindCloseBtnEvent(true);
            },
            error:()=>{
                $("#error-text").html("好像我与服务器分手了TAT");
            }
        });
    });

    // 给删除按钮绑定事件
    function bindCloseBtnEvent(onlyLast=false) {
    let $closeBtn = $(".close-btn");
    if(onlyLast){
        $closeBtn = $closeBtn.last();
    }
    $closeBtn.click(function(){
        $("#error-text").html("");
        let id = $(this).data("id");
        // 删除问题的逻辑
        $.ajax({
            url: "api/questionHandler/deleteQuestion",
            type: "post",
            data: {
                id: id
            },
            success: (response)=>{
                response = JSON.parse(response);
                if(response.code!=="0000"){
                    $("#error-text").html(response.msg);
                    return;
                }
                getQuestionList(currentPage);
                $(this).parent().remove();
            }
        });
    });
    }
    bindCloseBtnEvent();


    // 登出的逻辑
    $("#logout-btn").click(()=>{
        $.ajax({
            url: "/zero-question-list-tp/public/index/user/logout",
            type: "post",
            success: (data)=>{
                location.href= "/zero-question-list-tp/public/login";
            }
        });
    });

    function getQuestionList(page=1){
    $.ajax({
        url: "/zero-question-list-tp/public/index/question/getAllQuestions",
        type: "get",
        data:{
            page:page
        },
        success: (response)=>{
            response = JSON.parse(response);
            if(response.code!=="0000"){
                $("#error-text").html(response.msg);
                return;
            }
            renderQuestionList(response.data.questions);
            generatePaginationBtn(page,response.data.pageCount);
        },
        error:()=>{
            $("#error-text").html("好像我与服务器分手了TAT");
        }
    });
    }

    function renderQuestionList(data){
        $("#question-list").html("");
        for(let question of data){
            
            $("#question-list").append(`
            <div class="question-item">
                <p class="content">${question.question}</p>
                <p class="time">${question.time} by ${question.userName}</p>
                <button type="button" class="close close-btn" aria-label="Close" data-id="${question.id}"><span aria-hidden="true">&times;</span></button>
            </div>
            `);
        }
        bindCloseBtnEvent();
    }

    // 页面加载完成的时候请求问题列表
    $(window).on("load",()=>{
        $.ajax({
            url: "/zero-question-list-tp/public/index/user/get_nick_name",
            type: "get",
            success: (response)=>{
                // 验证一下这个用户到底登录了没有
                response = JSON.parse(response);
                if(response.code!=="0000"){
                    location.href = "/zero-question-list-tp/public/login";
                    return;
                }
                $("#nick-name").html(`${response.data}<span class="caret"></span>`);
                let currentPageRegex = /(page)=(\w+)/.exec(location.search);
                if(!currentPageRegex){
                    currentPage = 1;
                }else{
                    currentPage = Number(currentPageRegex[2]);
                }
                getQuestionList(currentPage);
            }
        });

    });
    
    /**
     * 生成分页器上面的数字按钮数组
     * @param currentPage 当前页面。这个数字必须大于等于1
     * @param pageCount 总共有多少个页面
     * @param paginationBtnCount 总共需要多少个分页按钮，默认是5个
     * @returns {Array|*[]} 返回数字按钮的数组
     */
    function generatePaginationNum(currentPage,pageCount,paginationBtnCount=5){

        let result = [];

        if(paginationBtnCount>=pageCount){
            for(let i=0;i<pageCount;i++){
                result.push(i+1);
            }
            return result;
        }

        // 1. 先生成一个初始数组

        // 当前页之前有多少个按钮
        let btnCountBefore = Math.floor((paginationBtnCount-1)/2);

        // 当前页之后有多少个按钮
        let btnCountAfter = Math.ceil((paginationBtnCount-1)/2);

        for(let i=currentPage-btnCountBefore;i<currentPage;i++){
            result.push(i);
        }
        result.push(currentPage);
        for(let i=currentPage+1;i<=currentPage+btnCountAfter;i++){
            result.push(i);
        }

        // 2. 向后滑动窗口
        if(result[0]<1){
            let offset = 1-result[0];
            for(let i=0;i<paginationBtnCount;i++){
                result[i]+=offset;
            }
        }
        // 3. 向前滑动窗口
        if(result[paginationBtnCount-1]>pageCount){
            let offset = result[paginationBtnCount-1]-pageCount;
            for(let i=0;i<paginationBtnCount;i++){
                result[i]-=offset;
            }
        }

        // 4. 切割数量
        result = result.slice(0,pageCount);
        return result;
    }


    function generatePaginationBtn(currentPage,pageCount){
        let paginationNumArr = generatePaginationNum(currentPage,pageCount);

        $("#pagination").html("");
        $("#pagination").append('\
        <li class="pagination-prev-btn">\
            <a href="#" aria-label="Previous">\
                <span aria-hidden="true">&laquo;</span>\
            </a>\
        </li>');
        $("#pagination").append(`
        <li class="pagination-prev-btn">
            <a href="#" aria-label="Previous">
                <span aria-hidden="true">&laquo;</span>
            </a>
        </li>
        `);
        for(let i=0;i<paginationNumArr.length;i++){
            $("#pagination").append(`
            <li class="pagination-num-btn" data-page="${paginationNumArr[i]}"><a href="#">${paginationNumArr[i]}</a></li>
            `);
        }
        $("#pagination").append(`
        <li class="pagination-next-btn">
            <a href="#" aria-label="Next">
                <span aria-hidden="true">&raquo;</span>
            </a>
        </li>`);

        $(".pagination-num-btn").click(function(){
            location.href=`index?page=${$(this).data("page")}`;
        });

        $(".pagination-prev-btn").click(()=>{
            if(currentPage!==1){
                location.href=`index?page=${currentPage-1}`;
            }
        });

        $(".pagination-next-btn").click(()=>{
            if(currentPage!==pageCount){
                location.href=`index?page=${currentPage+1}`;
            }
        });

    }
})();