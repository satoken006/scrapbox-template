$(function(){
    var padWithZero = day => ("00" + day).slice(-2);

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

    $(".month-select").each(function(){
        for (i of Array(12).keys()){
            var $option = $("<option>", {
                value: padWithZero(i+1)
            })
            .text(padWithZero(i+1));

            $(this).append($option);
        }
    });

    $(".year-select, .month-select").on("change", function(){
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

        // 研究ノートのストック（プロジェクトsatokenにジャンプ）
        var url_head = `https:/\/scrapbox.io/satoken/研究ノート_${year}.${month}_${USERNAME}`;

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
        body += `#${year_prev_tag}.${padWithZero(month_prev_tag)}_研究ノート_${USERNAME} `;
        body += `#${year_next_tag}.${padWithZero(month_next_tag)}_研究ノート_${USERNAME} `;
        body += `#${USERNAME}` + "\n".repeat(2);

        for(var d = 1; d <= LAST_DAY; d ++){
            var dwIndex = (dwIndex1st + d - 1) % NUM_DAYS_OF_WEEK;

            body += `[*( ${year}.${month}.${padWithZero(d)} (${DAY_OF_WEEK[dwIndex]})]\n`;
            body += "[_]\n".repeat(3);
            body += "\n";
            body += "[*> 雑記]";
            body += "\n".repeat(3);
        }

        body += `#${year_prev_tag}.${padWithZero(month_prev_tag)}_研究ノート_${USERNAME} `;
        body += `#${year_next_tag}.${padWithZero(month_next_tag)}_研究ノート_${USERNAME}`;

        var url = url_head + "?body=" + encodeURIComponent(body);
        $("#scrapboxLink").attr("href", url).text(url_head);
    });
});
