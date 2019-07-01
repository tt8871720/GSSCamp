
var bookDataFromLocalStorage = [];

$(function () {
    loadBookData();
    var data = [
        { text: "資料庫", value: "image/database.jpg" },
        { text: "網際網路", value: "image/internet.jpg" },
        { text: "應用系統整合", value: "image/system.jpg" },
        { text: "家庭保健", value: "image/home.jpg" },
        { text: "語言", value: "image/language.jpg" },
        { text: "行銷", value: "image/marketing.png" },
        { text: "管理", value: "image/management.png" }

    ]
    $("#book_category").kendoDropDownList({
        dataTextField: "text",
        dataValueField: "value",
        dataSource: data,
        index: 0,
        change: onChange
    });
    $("#bought_datepicker").kendoDatePicker();
    $("#book_grid").kendoGrid({
        dataSource: {
            data: bookDataFromLocalStorage,
            schema: {
                model: {
                    fields: {
                        BookId: { type: "int" },
                        BookName: { type: "string" },
                        BookCategory: { type: "string" },
                        BookAuthor: { type: "string" },
                        BookBoughtDate: { type: "string" }
                    }
                }
            },
            pageSize: 20,
            // filterable: true,
        },
        toolbar: kendo.template("<div class='book-grid-toolbar'><input class='book-grid-search' placeholder='依書籍名稱尋找......' type='text'></input></div>"),
        height: 550,
        sortable: true,
        pageable: {
            input: true,
            numeric: false
        },
        columns: [
            { field: "BookId", title: "書籍編號", width: "10%" },
            { field: "BookName", title: "書籍名稱", width: "40%" },
            { field: "BookCategory", title: "書籍種類", width: "20%" },
            { field: "BookAuthor", title: "作者", width: "15%" },
            { field: "BookBoughtDate", title: "購買日期", width: "15%" },
            { field: "BookPublisher", title: "出版社", width: "20%" },
            { command: { text: "刪除", click: deleteBook }, title: " ", width: "120px" }
        ]

    });

    //search
    $(".book-grid-search").on("input propertychange", function () {
        $("#book_grid").data("kendoGrid").dataSource.filter({
            filters: [{
                field: "BookName",
                operator: "contains",
                value: $(".book-grid-search").val()
            }]
        });
    });


    //create new window
    var add = $("#add");
    var addwindow = $("#addwindow");
    add.click(function () {
        addwindow.data("kendoWindow").open();
    })
    addwindow.kendoWindow({
        width: "500px",
        height: "450px",
        title: "add a new book",
        visible: false,
        //釘選,最大化,最小化,關閉
        actions: [
            "Pin",
            "Minimize",
            "Maximize",
            "Close"]
    }).data("kendoWindow").center();
    //add
    $("#sent").click(function () {
        addBook();
        kendo.alert("新增已成功");
        $("#book_name").val("");
        $("#book_author").val("");
        $("#book_publisher").val("");
    })
    //window.data("kendoWindow").close();

})

function loadBookData() {
    bookDataFromLocalStorage = JSON.parse(localStorage.getItem("bookData"));
    if (bookDataFromLocalStorage == null) {
        bookDataFromLocalStorage = bookData;
        localStorage.setItem("bookData", JSON.stringify(bookDataFromLocalStorage));
    }
}

function onChange() {
    $(".book-image").attr("src", $("#book_category").data("kendoDropDownList").value())
}

function deleteBook(e) {
    console.log(e);
    var target = this.dataItem($(e.currentTarget).closest("tr"));
    //查看目前目標 console.log(target);
    for (var i = 0; i <= bookDataFromLocalStorage.length; i++) {
        if (bookDataFromLocalStorage[i].BookId == target.BookId) {
            bookDataFromLocalStorage.splice(i, 1);
            break;
        }
    }
    //update
    localStorage.setItem("bookData", JSON.stringify(bookDataFromLocalStorage));
    $("#book_grid").data("kendoGrid").dataSource.data(bookDataFromLocalStorage);
}

function addBook() {
    const newdata = {

        "BookId": bookDataFromLocalStorage[bookDataFromLocalStorage.length - 1].BookId + 1,
        "BookCategory": $("#book_category").data("kendoDropDownList").text(),
        "BookName": $("#book_name").val(),
        "BookAuthor": $("#book_author").val(),
        //"BookBoughDate": kendo.toString($("#bought_datepicker"), "yyyy-MM-dd"),
        "BookBoughtDate": kendo.toString($("#bought_datepicker").data("kendoDatePicker").value(), "yyyy-MM-dd"),
        "BookPublisher": $("#book_publisher").val()
    }

    //update
    bookDataFromLocalStorage.push(newdata);
    console.log(newdata);
    localStorage.setItem("bookData", JSON.stringify(bookDataFromLocalStorage));
    $("#book_grid").data("kendoGrid").dataSource.data(bookDataFromLocalStorage);
}
