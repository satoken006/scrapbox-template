$(function(){
    var padWithZero = day => ("00" + day).slice(-2);

    // 年セレクトボックスの作成
    $(".year-select").each(function(){
        for(var i = 0; i < 2; i ++){
            var y = new Date().getFullYear() + i;
            var $option = $("<option>", {
                value: y
            })
            .text(y);

            $(this).append($option);
        }
    });

    // 月セレクトボックスの作成
    $(".month-select").each(function(){
        for (i of Array(12).keys()){
            var $option = $("<option>", {
                value: padWithZero(i+1)
            })
            .text(padWithZero(i+1));

            $(this).append($option);
        }
    });

    // リンク生成
    $(".year-select, .month-select, input[name=mode], input[name=project]").on("change", function(){
        const DAY_OF_WEEK = ["日", "月", "火", "水", "木", "金", "土"];
        const NUM_DAYS_OF_WEEK = DAY_OF_WEEK.length;

        var year = $(".year-select").val();
        var month = $(".month-select").val();
        var y = parseInt(year);
        var m = parseInt(month);
        // 入力月の1日の曜日を0-6で取得
        // 第2引数は0-11で正しく計算可能
        var dwIndex1st = new Date(y, m-1, 1).getDay();
        const LAST_DAY =  new Date(y, m, 0).getDate();

        // createの場合は両方ともPRIVATE、viewする場合はPUBLIC/PRIVATE
        if($("input[name=project]:eq(0)").prop("checked")){
            url_head = `https:/\/scrapbox.io/${PJNAME_PUBLIC}/${year}.${month}_研究ノート_${USERNAME}`;
        }else{
            url_head = `https:/\/scrapbox.io/${PJNAME_PRIVATE}/月報_${year}.${month}`;
        }

        // 作成/閲覧の切り替え結果は、ここでのみ使用
        if($("input[name=mode]:eq(1)").prop("checked")){
            $(this).siblings("a").attr("href", url_head).text(url_head);
            return;
        }

        var year_prev_tag = y;
        var year_next_tag = y;
        var month_prev_tag = m - 1;
        var month_next_tag = m + 1;

        if(month_prev_tag < 1){
            month_prev_tag = 12;
            year_prev_tag --;
        }else if(month_next_tag > 12){
            month_next_tag = 1;
            year_next_tag ++;
        }

        // ここからbodyを組み立てる
        var body = "";
        if($("input[name=project]:eq(0)").prop("checked")){
            body += `#${year_prev_tag}.${padWithZero(month_prev_tag)}_研究ノート_${USERNAME} `;
            body += `#${year_next_tag}.${padWithZero(month_next_tag)}_研究ノート_${USERNAME} `;
            body += `#${USERNAME}` + "\n".repeat(2);
        }else{
            body += `#月報_${year_prev_tag}.${padWithZero(month_prev_tag)} `;
            body += `#月報_${year_next_tag}.${padWithZero(month_next_tag)}`;
            body += "\n".repeat(2);
        }

        var headers = $("input[name=project]:eq(0)").prop("checked") ? HEADERS_PUBLIC : HEADERS_PRIVATE;

        for(var d = 1; d <= LAST_DAY; d ++){
            var dwIndex = (dwIndex1st + d - 1) % NUM_DAYS_OF_WEEK;

            body += `[*( ${year}.${month}.${padWithZero(d)} (${DAY_OF_WEEK[dwIndex]})]\n`;
            body += "[_]\n".repeat(3);
            body += "\n";
            headers.forEach(header =>
                body += `[*> ${header}]` + "\n".repeat(3)
            );
        }

        if($("input[name=project]:eq(0)").prop("checked")){
            body += `#${year_prev_tag}.${padWithZero(month_prev_tag)}_研究ノート_${USERNAME} `;
            body += `#${year_next_tag}.${padWithZero(month_next_tag)}_研究ノート_${USERNAME}`;
        }else{
            body += `#月報_${year_prev_tag}.${padWithZero(month_prev_tag)}　`;
            body += `#月報_${year_next_tag}.${padWithZero(month_next_tag)}`;
        }

        var url = url_head + "?body=" + encodeURIComponent(body);
        $(this).siblings("a").attr("href", url).text(url_head);
    });
});
