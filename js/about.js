/**
 * Created by li.lli on 2015/2/20.
 */

$(function () {
    //page options
    var options = {
        items_per_page: 10, //Number of items per page
        next_text: "下一页", //"Previous" label
        prev_text: "上一页", //"Next" label
        num_display_entries: 10,//Number of pagination links shown
        num_edge_entries: 2, //Number of start and end points
        callback: pageselectCallback //callback function when click page num
    };
    var config = {
        url: "mock/about.json", //ajax url
        element: $(".mainsub ul"), //parent dom of list elements
        template:$("#template")//dom of template
    };
    //initialize list
    renderContent(0, options.items_per_page,config);

    //nav effect
    $(".maintitle").on("click",function(){
       var parent = $(this).parent();
       parent.hasClass("show") ?
           parent.removeClass("show").addClass("hide"):
           parent.removeClass("hide").addClass("show");

       parent.find(".submenu").slideToggle();
       return false;
    });

    /**
     * Callback function that displays the content.
     * Gets called every time the user clicks on a pagination link.
     * @param {int}page_index New Page index
     */
    function pageselectCallback(page_index) {
        renderContent(page_index, options.items_per_page,config);
        return false;
    }

    /**
     * ajax get content from server
     */
    function renderContent(page_index,page_size,config) {
        $.get(config.url, { index: page_index, pagesize: page_size },
            function (result) {
                if (result.code != 0) {
                    alert(result.msg);
                } else {
                    var totalNum = +result.data.total || 0;
                    var arr = [], i = 0, item,
                        content = result.data.content || [],
                        template = config.template.html(),
                        len = content.length;
                    Mustache.parse(template);   // optional, speeds up future uses

                    for (; i < len; i += 1) {
                        item = content[i];
                        arr.push(Mustache.render(template, item));
                    }
                    config.element.html(arr.join(' '));
                    //if pagination not initialized
                    if ($(".pagination a").length === 0) {
                        $("#pagination").pagination(totalNum, options);
                    }
                }
            }
        );
    }
}());