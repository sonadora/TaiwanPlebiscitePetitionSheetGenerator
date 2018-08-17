
$(document).ready(function() {
    new TwCitySelector({
        el: "div#address",
        elCounty: "select#county",
        elDistrict: "select#district",
        elZipcode: "input#zipcode"
    });

    create_data_binding();
    $("button#export_pdf").click(export_pdf);
    change_topic($("select#topic").val());

    data_validation();
});

function copy_input_to_span(id) {
    $("input#" + id).keyup(function() {
        $("span#" + id).text($(this).val());
    })
}

function change_topic(topic) {
    $("link#petition_topic_css").attr('href',
                                      'topic/' + topic + '/PetitionSheet.css');
}

function handle_county_change() {
    county = $(this).val();
    county_name = county.substring(0, county.length - 1);
    county_type = county.substring(county.length - 1, county.length);

    if (county == '臺北市' || county == '新北市' || county == '臺中市' ||
        county == '桃園市' || county == '臺南市' || county == '高雄市') {
        $("span#province").text(county_name);
        $("div.province_1_circle").hide();
        $("div.province_2_circle").show();
        $("span#county").text('');
        $("div.county_1_circle").hide();
        $("div.county_2_circle").hide();
        return;
    }

    if (county == '金門縣' || county == '連江縣') {
        $("span#province").text('福建');
        $("div.province_1_circle").show();
        $("div.province_2_circle").hide();
        $("span#county").text(county_name);
        $("div.county_1_circle").show();
        $("div.county_2_circle").hide();
        return;
    }

    $("span#province").text('臺灣');
    $("div.province_1_circle").show();
    $("div.province_2_circle").hide();
    $("span#county").text(county_name);
    if (county_type == '縣') {
        $("div.county_1_circle").show();
        $("div.county_2_circle").hide();
    } else if (county_type == '市') {
        $("div.county_1_circle").hide();
        $("div.county_2_circle").show();
    } else {
        $("div.county_1_circle").hide();
        $("div.county_2_circle").hide();
    }
}

function handle_district_change() {
    district = $(this).val();
    district_name = district.substring(0, district.length - 1);
    district_type = district.substring(district.length - 1, district.length);

    if (district_type == '鄉') {
        $("span#district").text(district_name);
        $("div.district_1_circle").show();
        $("div.district_2_circle").hide();
        $("div.district_3_circle").hide();
        $("div.district_4_circle").hide();
    } else if (district_type == '鎮') {
        $("span#district").text(district_name);
        $("div.district_1_circle").hide();
        $("div.district_2_circle").show();
        $("div.district_3_circle").hide();
        $("div.district_4_circle").hide();
    } else if (district_type == '市') {
        $("span#district").text(district_name);
        $("div.district_1_circle").hide();
        $("div.district_2_circle").hide();
        $("div.district_3_circle").show();
        $("div.district_4_circle").hide();
    } else if (district_type == '區') {
        $("span#district").text(district_name);
        $("div.district_1_circle").hide();
        $("div.district_2_circle").hide();
        $("div.district_3_circle").hide();
        $("div.district_4_circle").show();
    } else {
        $("span#district").text(district);
        $("div.district_1_circle").hide();
        $("div.district_2_circle").hide();
        $("div.district_3_circle").hide();
        $("div.district_4_circle").hide();
    }
}

function handle_road_change() {
    road = $(this).val();
    road_name = road.substring(0, road.length - 1);
    road_type = road.substring(road.length - 1, road.length);

    if (road_type == '路') {
        $("span#road").text(road_name);
        $("div.road_1_circle").show();
        $("div.road_2_circle").hide();
    } else if (road_type == '街') {
        $("span#road").text(road_name);
        $("div.road_1_circle").hide();
        $("div.road_2_circle").show();
    } else {
        $("span#road").text(road);
        $("div.road_1_circle").hide();
        $("div.road_2_circle").hide();
    }
}

function handle_village_change() {
    village = $(this).val();
    village_name = village.substring(0, village.length - 1);
    village_type = village.substring(village.length - 1, village.length);

    if (village_type == '村') {
        $("span#village").text(village_name);
        $("div.village_1_circle").show();
        $("div.village_2_circle").hide();
    } else if (village_type == '里') {
        $("span#village").text(village_name);
        $("div.village_1_circle").hide();
        $("div.village_2_circle").show();
    } else {
        $("span#village").text(village);
        $("div.village_1_circle").hide();
        $("div.village_2_circle").hide();
    }
}

function set_element_style(element, valid) {
    if (valid) {
        element.css("border-style", "");
        element.css("border-width", "");
        element.css("border-color", "");
    } else {
        element.css("border-style", "solid");
        element.css("border-width", "medium");
        element.css("border-color", "#af191c");
    }
}

function id_validation(id) {
    id_regexp = new RegExp('^[A-Z][12][0-9]{8}$');
    if (!id_regexp.test(id)) {
        return false;
    }

    alpha_base = 10;
    alpha_order = 'ABCDEFGHJKLMNPQRSTUVXYWZIO';
                // :10  :15  :20  :25  :30  :35

    id_alpha_value = alpha_base + alpha_order.indexOf(id.charAt(0));
    id_value = [Math.floor(id_alpha_value / 10), id_alpha_value % 10];
    for (i = 1; i < id.length; i++) {
        id_value.push(parseInt(id.charAt(i), 10));
    }

    id_weight = [1, 9, 8, 7, 6, 5, 4, 3, 2, 1, 1];
    sum = 0;
    for (i = 0; i < id_value.length; i++) {
        sum += id_value[i] * id_weight[i];
    }

    if (sum % 10 != 0) {
        return false;
    }

    return true;
}

function birthday_validation(year_element, month_element, date_element) {
    birth_year = year_element.val();
    birth_month = month_element.val();
    birth_date = date_element.val();
    nowDate = new Date();
    nowYear = nowDate.getFullYear();
    nowChYear = nowYear - 1911;

    if(birth_year > nowChYear) {
        return false;
    } else {
        input_birthday_string = birth_year + '-' + birth_month + '-' + birth_date;
        birthday = new Date(parseInt((birth_year), 10)+1911, parseInt(birth_month, 10) - 1,
                        parseInt(birth_date, 10));
        parsed_birthday_string = (birthday.getFullYear()-1911).toString() + '-' +
                             (birthday.getMonth() + 1).toString() + '-' +
                             birthday.getDate().toString();
        if (input_birthday_string != parsed_birthday_string) {
            return false;
        }
   }

    // Check above age 18.
    // FIXME: Different petition has different due date.
    due_year = nowChYear;
    due_month = 8;
    due_date = 31;

    if (due_year - birth_year < 18) {
        return false;
    }

    if (due_year - birth_year == 18 && due_month < birth_month) {
        return false;
    }

    if (due_year - birth_year == 18 && due_month == birth_month &&
        due_date < birth_date) {
        return false;
    }
    return true;
}

function data_validation() {
    result = true;

    element = $("select#county");
    valid = element.val() != "";
    set_element_style(element, valid);
    result = result & valid;

    element = $("select#district");
    valid = element.val() != "";
    set_element_style(element, valid);
    result = result & valid;

    element = $("input#name");
    valid = element.val() != "";
    set_element_style(element, valid);
    result = result & valid;

    element = $("input#village");
    village = element.val();
    village_name = village.substring(0, village.length - 1);
    village_type = village.substring(village.length - 1, village.length);
    valid = element.val() != "" && (village_type == '村' || village_type == '里');
    set_element_style(element, valid);
    result = result & valid;

    element = $("input#neighbor");
    valid = element.val() != "";
    set_element_style(element, valid);
    result = result & valid;

    element = $("input#number");
    valid = element.val() != "";
    set_element_style(element, valid);
    result = result & valid;

    element = $("input#id");
    valid = id_validation(element.val());
    set_element_style(element, valid);
    result = result & valid;

    year_element = $("input#year");
    month_element = $("input#month");
    date_element = $("input#date");
    valid = birthday_validation(year_element, month_element, date_element);
    set_element_style(year_element, valid);
    set_element_style(month_element, valid);
    set_element_style(date_element, valid);
    result = result & valid;

    return result;
}

function update_envelope() {
    $("span#sender_zipcode").text($("input#zipcode").val());
    $("span#sender_name").text($("input#name").val());
    sender_address = $("select#county").val() +
        $("select#district").val() +
        $("input#village").val() +
        $("input#neighbor").val() + '鄰' +
        $("input#road").val() +
        ($("input#section").val() == '' ? '' : $("input#section").val() + '段') +
        ($("input#lane").val() == '' ? '' : $("input#lane").val() + '巷') +
        ($("input#alley").val() == '' ? '' : $("input#alley").val() + '弄') +
        $("input#number").val() + '號' +
        ($("input#floor").val() == '' ? '' : $("input#floor").val() + '樓') +
        ($("input#part").val() == '' ? '' : '之' + $("input#part").val());
    $("span#sender_address").text(sender_address);

    // FIXME: The address mapping is for "National Holiday Law" and "Labor Law"
    // petition only.
    receiver_zipcode = '';
    receiver_address = '';
    receiver_name = '';

    county = $("select#county").val();
        receiver_zipcode = '30099';
        receiver_address = '新竹市清華大學郵局 第180號信箱';
        receiver_name = '以核養綠公投領銜人 黃士修 先生';
    
    $("span#receiver_zipcode").text(receiver_zipcode);
    $("span#receiver_address").text(receiver_address);
    $("span#receiver_name").text(receiver_name + '　收');
}

function form_data_change() {
    data_validation();
    update_envelope();
}

function create_data_binding() {
    copy_input_to_span("id")
    copy_input_to_span("year")
    copy_input_to_span("month")
    copy_input_to_span("date")
    copy_input_to_span("neighbor")
    copy_input_to_span("section")
    copy_input_to_span("lane")
    copy_input_to_span("alley")
    copy_input_to_span("number")
    copy_input_to_span("floor")
    copy_input_to_span("part")

    $("select#county").change(handle_county_change)
    $("select#district").change(handle_district_change)
    $("input#village").keyup(handle_village_change)
    $("input#road").keyup(handle_road_change)

    $("select#topic").change(function() {
        change_topic($(this).val());
    })

    $("div#form_table").change(form_data_change)
    $("div#form_table").keyup(form_data_change)
}

function export_pdf() {
    if (!data_validation()) {
        alert('資料不齊全或錯誤，請修正紅框標示處的資料，若為程式誤判請聯絡我們');
        return;
    }

    html2canvas($("div#sheet"), {
        useCORS: true,
        allowTaint: true,
        taintTest: false,
        onrendered: function(sheet_canvas) {
            var sheet_img = sheet_canvas.toDataURL('image/jpeg', 1.0);

            html2canvas($("div#envelope"), {
                useCORS: true,
                allowTaint: true,
                taintTest: false,
                onrendered: function(envelope_canvas) {
                    // Rotate envelop 90 degrees right.
                    rotated_envelope_canvas = document.createElement('canvas');
                    rotated_envelope_canvas.width = envelope_canvas.height;
                    rotated_envelope_canvas.height = envelope_canvas.width;
                    rotated_envelope_ctx = rotated_envelope_canvas.getContext('2d');
                    rotated_envelope_ctx.rotate(90 * Math.PI / 180);
                    rotated_envelope_ctx.drawImage(
                        envelope_canvas,
                        0,
                        -envelope_canvas.height
                    );
                    var envelop_imge = rotated_envelope_canvas.toDataURL('image/jpeg', 1.0);

                    var pdf = new jsPDF('l', 'pt', 'a4');
                    pdf.addImage(sheet_img, 'JPEG', 0, 0);
                    pdf.addPage();
                    pdf.addImage(envelop_imge, 'JPEG', 0, 0);

                    topic = $("select#topic option:selected").text();
                    pdf.save('公投連署書 - ' + topic + '（請雙面列印）.pdf');
                }
            })
        }
    });
}
