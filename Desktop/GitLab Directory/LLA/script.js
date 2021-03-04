Knack = Knack || {};
Knack.fn = Knack.fn || {};

Knack.fn.tempPassGenerator = function (labelName) {
  var div = Knack.$(`.label.kn-label span:contains('${labelName}')`)
    .parent()
    .parent()
    .attr("id");
  var field = `#${div} .input`;
  var control = `#${div} .control`;

  var randchar = Math.random()
    .toString(36)
    .replace(/[^a-z]+/g, "")
    .substr(0, 8);

  Knack.$(field).val(randchar);
  Knack.$(field).prop("disabled", true);
  Knack.$(control).hover(function () {
    Knack.$(control)
      .css({
        cursor: "pointer",
        border: "1px solid green",
      })
      .on("mouseleave", function () {
        var styles = {
          border: "none",
        };
        Knack.$(control).css(styles);
      });
  });
  Knack.$(control).click(function () {
    randchar = Math.random()
      .toString(36)
      .replace(/[^a-z]+/g, "")
      .substr(0, 8);
    Knack.$(field).val(randchar);
  });
};

$(document).on("knack-scene-render.any", function (event, scene) {
  if (Knack.$(".kn-login").length !== 1) {
    var selectedlng = sessionStorage.getItem("userLng");
    var lng = Knack.user.attributes.values.field_130;
    if (selectedlng !== lng) {
      sessionStorage.setItem("userLng", lng);
    }
  }
});

$(document).on("knack-view-render.view_159", function (event, view, record) {
  Knack.fn.tempPassGenerator("Temp Password");
});
$(document).on("knack-view-render.view_160", function (event, view, record) {
  Knack.fn.tempPassGenerator("Temp Password");
});
$(document).on("knack-view-render.view_161", function (event, view, record) {
  Knack.fn.tempPassGenerator("Temp Password");
});
/**
 * Render View view_71 add eyeballs
 *
 */
$(document).on("knack-view-render.view_71", function (event, view, data) {
  Knack.$(".eyeid").remove();
  Knack.$(".field_52.cell-edit a").prepend(`<i class="fa fa-eye eyeid"> </i>`);
});
/**
 * Render view_77 add eyeballs
 *
 */
$(document).on("knack-view-render.view_77", function (event, view, data) {
  Knack.$(".eyeid").remove();
  Knack.$(".field_79.cell-edit a").prepend(`<i class="fa fa-eye eyeid"> </i>`);
  Knack.$(".field_80.cell-edit a").prepend(`<i class="fa fa-eye eyeid"> </i>`);
});

/**
 *
 * Language Plugin.
 *
 */

Knack.fn = Knack.fn || {};
Knack.data = Knack.data || {};
Knack.data.account_language = Knack.data.account_language || {};
Knack.data.ac_lng_collection = Knack.data.ac_lng_collection || {};

Knack.fn.languageTraslate = function (lng) {
  traslateNow = function () {
    Knack.data.account_language &&
      Knack.data.account_language.field_199_raw
        .split("\n")
        .flatMap(function (e, i) {
          let text_traslate = e.split("|&|");
          if (
            String(text_traslate[1]).trim() !== undefined &&
            String(text_traslate[1]).trim()
          ) {
            Knack.data.ac_lng_collection[
              String(text_traslate[0]).toLowerCase().trim()
            ] = String(text_traslate[1]).trim();
          }
        });

    delete Knack.data.ac_lng_collection[""];
    delete Knack.data.ac_lng_collection[" "];

    return true;
  };

  _construct = function (lng, callback) {
    var _filters = {
      match: "and",
      rules: [
        {
          field: "field_197",
          operator: "is",
          value: String(lng).toLocaleUpperCase(),
          field_name: "ISO+639+-+1",
        },
      ],
    };
    _filters = encodeURIComponent(JSON.stringify(_filters));

    Knack.$.ajax({
      url:
        "https://eu-central-1-renderer-read.knack.com/v1/scenes/scene_128/views/view_127/records?filters=" +
        _filters,
      type: "GET",
      headers: {
        "X-Knack-Application-Id": Knack.application_id,
        "X-Knack-REST-API-Key": "renderer",
        Authorization: Knack.getUserToken(),
      },
      success: function (data) {
        Knack.data.account_language =
          data && data.records && data.records[0] ? data.records[0] : "";
        typeof callback === "function" && callback();
      },
    });
  };
  (Object.keys(Knack.data.account_language).length > 0 && traslateNow()) ||
    _construct(lng, traslateNow);

  return {
    traslateNow: function (str_elem_selectors) {
      Knack.$(str_elem_selectors).map(function (_i, e) {
        try {
          if (e.childElementCount == 0) {
            let $e = Knack.$(e);
            original_str = String($e.text()).toLowerCase().trim();
            traslate_str = Knack.data.ac_lng_collection[original_str];
            traslate_str && $e.html(traslate_str);
          }
        } catch (err) {}
      });
    },
    traslateTo: function (lang) {
      _construct(lang, traslateNow);
    },
    traslateRegEx: function (str_elem_selectors) {
      Knack.data.ac_lng_collection_regx =
        Knack.data.ac_lng_collection_regx || [];
      Knack.data.account_language &&
        Knack.data.account_language.field_202_raw
          .split("\n")
          .flatMap(function (e, i) {
            let text_traslate = e.split("|&|");
            if (
              String(text_traslate[1]).trim() !== undefined &&
              String(text_traslate[1]).trim()
            ) {
              Knack.data.ac_lng_collection_regx[
                String(text_traslate[0]).toLowerCase().trim()
              ] = String(text_traslate[1]).trim();
            }
          });

      // search text on the Regex List
      let RgxList = Object.keys(Knack.data.ac_lng_collection_regx);

      function chkTextInRegexList(rgxlst, str) {
        for (var i = 0; i < rgxlst.length; i++) {
          if (new RegExp(rgxlst[i]).test(str)) {
            return rgxlst[i];
          }
        }
      }

      Knack.$(str_elem_selectors).map(function (_i, e) {
        try {
          if (e.childElementCount == 0) {
            let $e = Knack.$(e);
            original_str = String($e.text()).toLowerCase().trim();

            let rgxIndex = chkTextInRegexList(RgxList, original_str);
            let RegxReplace = Knack.data.ac_lng_collection_regx[rgxIndex];

            var reg = eval(`/${rgxIndex}/`);
            traslate_str = original_str.replace(reg, RegxReplace);

            traslate_str && $e.html(traslate_str);
          }
        } catch (err) {}
      });
    },
    backgroundTraslate: function () {
      let str_elem_selectors = ["input"];
      str_elem_selectors = str_elem_selectors.join(", ");

      Knack.$(str_elem_selectors).map(function (_i, e) {
        try {
          if (e.childElementCount == 0) {
            let $e = Knack.$(e);
            original_str = String($e.attr("placeholder")).toLowerCase().trim();
            traslate_str = Knack.data.ac_lng_collection[original_str];
            traslate_str && $e.attr("placeholder", traslate_str);
          }
        } catch (err) {}
      });
    },
  };
};

var user_language =
  Knack.getUserAttributes().values &&
  Knack.getUserAttributes().values["field_201"];

Knack.fn.traslateLng = new Knack.fn.languageTraslate(
  String(user_language).toLowerCase()
);

var sl_elements = [
  ".kn-table-link a.kn-link",
  ".kn-info.kn-container",
  "#app-menu-container span",
  "#app-menu-container label",
  "#app-menu-container a",
  ".kn-info.kn-container *",
  ".kn-modal *",
  ".kn-modal p",
  ".modal-card-head *",
  ".modal-card-body select option",
  "option",
];

Knack.data.sl_elements = sl_elements.join(", ");

Knack.data.regxSelectors = ['[name="page_select"] option', ".kn-total-pages"];
Knack.data.regxSelectors = Knack.data.regxSelectors.join(", ");

/**
 * Load Page
 *
 */

window.onhashchange = function () {
  try {
    var selectors = Knack.data.sl_elements;
    Knack.fn.traslateLng.traslateNow(selectors);

    Knack.fn.traslateLng.traslateRegEx(Knack.data.regxSelectors); // Regex Traslate
    Knack.fn.traslateLng.backgroundTraslate();
  } catch (e) {}
};

window.onload = function () {
  try {
    var selectors = Knack.data.sl_elements;
    Knack.fn.traslateLng.traslateNow(selectors);

    Knack.fn.traslateLng.traslateRegEx(Knack.data.regxSelectors); // Regex Traslate
    Knack.fn.traslateLng.backgroundTraslate();
  } catch (e) {}
};

function rafAsync() {
  return new Promise((resolve) => {
    requestAnimationFrame(resolve); //faster than set time out
  });
}

/* 
function checkElement(selector) {
    if (document.querySelector(selector) === null) {
        return rafAsync().then(() => checkElement(selector));
    } else {
        return Promise.resolve(true);
    }
} 
*/

async function checkElement(selector) {
  const querySelector = document.querySelector(selector);
  while (querySelector === null) {
    await rafAsync();
  }
  return querySelector;
}

checkElement("body") //use whichever selector you want
  .then((element) => {
    console.info(element);
    //Do whatever you want now the element is there
  });

/**
 * Render any views
 *
 */
$(document).on("knack-view-render.any", function (event, view, data) {
  try {
    var selectors = `#${view.key} span, #${view.key} a, #${view.key} label, ${Knack.data.sl_elements}`;
    Knack.fn.traslateLng.traslateNow(selectors);

    Knack.fn.traslateLng.traslateRegEx(Knack.data.regxSelectors); // Regex Traslate
    Knack.fn.traslateLng.backgroundTraslate();
  } catch (e) {}
});

$(document).on("knack-scene-render.any", function (event, scene) {
  if (!Knack.showModal_old) Knack.showModal_old = Knack.showModal;

  if (typeof Knack.showModal_old === "function") {
    Knack.showModal = function (e) {
      Knack.showModal_old(e);
      var sl_elements = [
        ".kn-table-link a.kn-link",
        ".kn-info.kn-container",
        "#app-menu-container span",
        "#app-menu-container label",
        "#app-menu-container a",
        ".kn-info.kn-container *",
        ".kn-modal *",
        ".kn-modal p",
        ".modal-card-head *",
        ".modal-card-body select option",
        "option",
      ];

      Knack.data.sl_elements = sl_elements.join(", ");

      var selectors = Knack.data.sl_elements;
      Knack.fn.traslateLng.traslateNow(selectors);

      setTimeout(() => {
        Knack.fn.traslateLng.traslateNow(selectors);
      }, 250);
    };
  }
});

/**
 * Set filter to cayman - view_263
 */
$(document).on("knack-view-render.view_263", function (event, view, data) {
  Knack.$("#kn-map-view_263").on("click", () => {
    if (Knack.$("#firstHeading").length) {
      let selected = Knack.$(".kn-list-item-container.active");
      let siteDes = Knack.$(selected).find(".field_29").text().trim();
      let elevation = Knack.$(selected).find(".field_167").text().trim();
      let address = `${Knack.$(selected)
        .find(".field_30")
        .text()
        .trim()} ${Knack.$(selected).find(".field_31").text().trim()} ${Knack.$(
        selected
      )
        .find(".field_32")
        .text()
        .trim()} ${Knack.$(selected).find(".field_33").text().trim()}`;
      let bodyHtml = `
    <p>Description: ${siteDes}</p>
    <p>Elevation: ${elevation}</p>
    <p>Address: ${address}</p>
    `;
      setTimeout(() => {
        Knack.$("#bodyContent p").find("a").parent().remove();
        Knack.$("#bodyContent").append(bodyHtml);
      }, 300);
    }
  });

  Knack.$(".kn-list-item-container").on("click", function () {
    console.log("click");
    let siteDes = Knack.$(this).find(".field_29").text().trim();
    let elevation = Knack.$(this).find(".field_167").text().trim();
    let address = `${Knack.$(this).find(".field_30").text().trim()} ${Knack.$(
      this
    )
      .find(".field_31")
      .text()
      .trim()} ${Knack.$(this).find(".field_32").text().trim()} ${Knack.$(this)
      .find(".field_33")
      .text()
      .trim()}`;

    let bodyHtml = `
    <p>Description: ${siteDes}</p>
    <p>Elevation: ${elevation}</p>
    <p>Address: ${address}</p>
    `;

    setTimeout(() => {
      Knack.$("#bodyContent p").find("a").parent().remove();
      Knack.$("#bodyContent").append(bodyHtml);
    }, 300);
  });

  Knack.$(".kn-map-search").hide();
  if (Knack.getUserRoles().indexOf("object_7") > -1) {
    Knack.$('.kn-details-column a:contains("View Site Details")').hide();
  } else if (Knack.getUserRoles().indexOf("object_6") > -1) {
    console.log("is admin");
    Knack.$('.kn-details-column a:contains("View Site Info")').hide();
  } else {
    Knack.$('.kn-details-column a:contains("View Site Details")').hide();
    Knack.$('.kn-details-column a:contains("View Site Info")').hide();
  }
  if (
    window.location.href !==
    "https://lla.knack.com/lla-asset-location-database#sites-map-navbar/"
  )
    return;

  window.location.replace(
    "https://lla.knack.com/lla-asset-location-database#sites-map-navbar/?view_263_filters=%7B%22match%22%3A%22and%22%2C%22rules%22%3A%5B%7B%22field%22%3A%22field_33%22%2C%22operator%22%3A%22is%22%2C%22value%22%3A%22Cayman%20Islands%22%2C%22field_name%22%3A%22Country%22%7D%2C%7B%22field%22%3A%22field_169%22%2C%22operator%22%3A%22near%22%2C%22value%22%3A%22Cayman%20%22%2C%22range%22%3A%22100000%22%2C%22units%22%3A%22kilometers%22%2C%22field_name%22%3A%22_Coordinates%22%7D%5D%7D&view_263_page=1"
  );

  //window.location.replace(currentUrl + filterParams);
});

/**
 * When cordonate changes change it in both areas - view_296
 */
$(document).on("knack-view-render.view_296", function (event, view, data) {
  //disable inputs
  const siteCategoryField = document.querySelector("#view_296 #view_296-field_205");
  const siteDescriptionField = document.querySelector("#view_296 #field_29");
  siteCategoryField.disabled = true;
  siteDescriptionField.disabled = true;

  Knack.$("#field_35, #field_36").keyup(function () {
    let lat = Knack.$("#field_35").val();
    let long = Knack.$("#field_36").val();
    Knack.$("#latitude").val(lat);
    Knack.$('input[name="longitude"]').val(long);
  });
});

/**
*  - view_240
*/
$(document).on('knack-view-render.view_240', function(event, view, data) {
  //disable inputs
  const siteCategoryField = document.querySelector("#view_240 #view_296-field_205");
  const siteDescriptionField = document.querySelector("#view_40 #field_29");
  siteCategoryField.disabled = true;
  siteDescriptionField.disabled = true;
});
/*
Knack.fn.toFixDecimalNumbers = function(field,arrayNum){
    let testNew = Knack.$(`.kn-detail.${field} span`)[1].innerText;
    let spliteTest = testNew.slice(0, 7);
    let detailBody = Knack.$('.kn-detail-body')[arrayNum].innerText;
    detailBody.replace(`${testNew}`,`${spliteTest}`)
    console.log('to fix function was called')
}
$(document).on("knack-scene-render.scene_76", function (event, scene) {
    Knack.fn.toFixDecimalNumbers ('field_35', 12);
});*/

/**
 *  - scene_263
 */
Knack.dt = Knack.dt || {};

Knack.fn.setCategory = function (occupanciesKey, editSiteKey) {
  let highestOccupancies = {
    0: [],
    1: [],
    2: [],
    3: [],
  };
  let differences = false;

  let initialVal = parseInt(
    Knack.fn.getKeyByValue(
      Knack.dt.letterMap,
      Knack.$(`#${editSiteKey}-field_205`).val()
    )
  );
  let highest = 0;
  Knack.views[occupanciesKey].model.data.models.forEach((row) => {
    let { field_82_raw: occupancyName } = row.attributes;
    occupancyName = occupancyName.toLowerCase().trim();
    let catVal = 0;
    try {
      catVal = Knack.dt.categoryMap.filter((cat) => {
        return (
          cat.name.toLowerCase().trim() === occupancyName.toLowerCase().trim()
        );
      })[0];

      //add description items to object Knack.dt.highest...
      let formatedCat = catVal.name
        .toLowerCase()
        .replace(/ *\([^)]*\) */g, "")
        .split("-")[0]
        .trim();
      if (highestOccupancies[catVal.val].indexOf(formatedCat) === -1) {
        highestOccupancies[catVal.val].push(formatedCat);
      }
      if (catVal.val > highest) highest = catVal.val;
    } catch (error) {}
  });
  if (initialVal !== highest) {
    console.log(
      `Change from ${Knack.dt.letterMap[initialVal]} to ${Knack.dt.letterMap[highest]}`
    );
    Knack.$(`#${editSiteKey}-field_205`).val(Knack.dt.letterMap[highest]);

    //!Mark different and save changes at end
    differences = true;
  }

  //Check description

  //make alphabetical
  for (let prop in highestOccupancies) {
    highestOccupancies[prop].sort();
  }
  console.log(highestOccupancies);

  function convertCase(str) {
    var lower = String(str).toLowerCase();
    return lower.replace(/(^| )(\w)/g, function (x) {
      return x.toUpperCase();
    });
  }

  //iterate backwards
  let siteDescriptionItemsInOrder = [];
  for (let i = 3; i > -1; i--) {
    let arrSet = highestOccupancies[i];
    arrSet.forEach((item) => {
      siteDescriptionItemsInOrder.push(convertCase(item));
    });
  }

  //get top 3 and make into string

  siteDescriptionItemsInOrder = siteDescriptionItemsInOrder.slice(0, 3);
  let finalText = "";
  if (siteDescriptionItemsInOrder.length === 3) {
    finalText = `${siteDescriptionItemsInOrder[0]}, ${siteDescriptionItemsInOrder[1]} & ${siteDescriptionItemsInOrder[2]}`;
  } else if (siteDescriptionItemsInOrder.length === 2) {
    finalText = `${siteDescriptionItemsInOrder[0]} & ${siteDescriptionItemsInOrder[1]}`;
  } else {
    finalText = `${siteDescriptionItemsInOrder[0]}`;
  }

  //!change to final text if different
  let priorDesc = Knack.$("#field_29").val();
  if (Knack.$("#field_29").val() !== finalText) {
    differences = true;
    console.log("there are differences %o", finalText);
    Knack.$("#field_29").val(finalText);
  }

  if (differences) {
    Knack.$("#reviewCat").remove();
    Knack.$(`#${occupanciesKey}`).before(
      '<button id="reviewCat">Review Description & Category</button>'
    );
    console.log("submit!!");
    Knack.$("#reviewCat").on("click", function () {
      let confirmed = confirm(
        `Would you like to change the following:\nSite category from ${Knack.dt.letterMap[initialVal]} to ${Knack.dt.letterMap[highest]}\nSite Description from\nPrevious: ${priorDesc}\nto\nNew: ${finalText}`
      );
      if (confirmed) {
        Knack.$(`#${editSiteKey} form`).trigger("submit");
      }
    });
  }
};

Knack.dt.letterMap = {
  0: "T",
  1: "C",
  2: "B",
  3: "A",
};

Knack.dt.categoryMap = [
  { name: "Airfiber Transmission", val: 1 },
  { name: "Battery Back up (UPS)", val: 1 },
  { name: "Catering Outlet", val: 1 },
  { name: "Cell Site (Rooftop Pole mtd)", val: 0 },
  { name: "Cell Site (Rooftop Tower mtd)", val: 0 },
  { name: "Cell site (Rooftop Wall mtd)", val: 0 },
  { name: "Cell Site Equipment", val: 0 },
  { name: "Childcare facilties", val: 1 },
  { name: "Datacentre (Customer services)", val: 3 },
  { name: "Datacentre (for LLA’s own corporate services)", val: 3 },
  { name: "Fuel / oil tank <100L", val: 1 },
  { name: "Fuel / oil tank 1,001L to 2,000L", val: 1 },
  { name: "Fuel / oil tank 101L to 500L", val: 1 },
  { name: "Fuel / oil tank 2,000L+", val: 1 },
  { name: "Fuel / oil tank 501L to 1,000L", val: 1 },
  { name: "Headend - All services in country", val: 3 },
  { name: "Headend - Broadband", val: 3 },
  { name: "Headend - Country", val: 3 },
  { name: "Headend - Mobile", val: 3 },
  { name: "Headend - Regional", val: 3 },
  { name: "Headend - Regional TV", val: 3 },
  { name: "Headend - TV", val: 3 },
  { name: "Headend - Voice", val: 3 },
  { name: "Hub Site", val: 2 },
  { name: "Indoor", val: 0 },
  { name: "Indoor DOT", val: 0 },
  { name: "Indoor ION-B", val: 0 },
  { name: "Indoor Lampsite", val: 0 },
  { name: "International Cable", val: 3 },
  { name: "ION-B - Outdoor", val: 1 },
  { name: "Land, no building", val: 1 },
  { name: "Microwave Communications Equipment", val: 1 },
  { name: "Mobile Building", val: 1 },
  { name: "Network Interconnect", val: 2 },
  { name: "Network Operations Centre (NOC)", val: 3 },
  { name: "Network Operations Centre (Sub Sea)", val: 3 },
  { name: "Office", val: 2 },
  { name: "OTN", val: 1 },
  { name: "Parking", val: 1 },
  { name: "POP", val: 1 },
  { name: "Radio Transmission", val: 0 },
  { name: "Repeater - Indoor", val: 0 },
  { name: "Repeater - Outdoor", val: 0 },
  { name: "Residential property", val: 1 },
  { name: "Retail outlet (Mobile)", val: 2 },
  { name: "Retail outlet (voice/BB/TV)", val: 2 },
  { name: "Satellite Dish", val: 1 },
  { name: "Satellite Dish (TV/Earth Station)", val: 1 },
  { name: "Security Booth", val: 1 },
  { name: "Site - No buildings", val: 1 },
  { name: "SmallCell", val: 0 },
  { name: "Solar - Roof mounted - >500kw installation", val: 1 },
  { name: "Sports Club", val: 1 },
  { name: "Standby Generation ( large capacity)", val: 1 },
  { name: "Standby Generation (medium capacity)", val: 1 },
  { name: "Standby Generation (small capacity)", val: 1 },
  { name: "Storage (with Handsets)", val: 1 },
  { name: "Storage (without handsets)", val: 1 },
  { name: "Storage External (Third Party)", val: 1 },
  { name: "Training Centre", val: 2 },
  { name: "TV production", val: 3 },
  { name: "Unused Property with Building", val: 1 },
  { name: "VSAT Antenna", val: 1 },
  { name: "Workshop (automotive)", val: 1 },
  { name: "Workshop (buildng and civils)", val: 1 },
  { name: "Workshop (electrical, electronic)", val: 1 },
  { name: "Workshop (mechanical)", val: 1 },
];
Knack.fn.getKeyByValue = function (object, value) {
  return Object.keys(object).find((key) => object[key] === value);
};
$(document).on("knack-scene-render.scene_263", function (event, scene) {
  Knack.fn.setCategory("view_403", "view_400");
});

/**
 *  - scene_87
 */
$(document).on("knack-scene-render.scene_87", function (event, scene) {
  Knack.fn.setCategory("view_406", "view_402");
});
