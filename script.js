var profList = [];
var numOfProf = 0;

function numOfProfessors() {
  // var numOfProf = 1;
  const url = "https://www.ratemyprofessors.com/filter/professor/?&page=1&filter=teacherlastname_sort_s+asc&query=*%3A*&queryoption=TEACHER&queryBy=schoolId&sid=1253";

  chrome.runtime.sendMessage(
    //goes to bg_page.js
    url,
    (data) => (numOfProf = data.searchResultsTotal)
  );
}

numOfProfessors();

// function searchLast(key, myArray) {
//   for (var i = 0; i < myArray.length; i++) {
//     if (myArray[i].tFname === key) {
//       return myArray[i];
//     }
//   }
// }

// function searchFirst(key, myArray) {
//   for (var i = 0; i < myArray.length; i++) {
//     if (myArray[i].tLname === key) {
//       return myArray[i];
//     }
//   }
// }

function searchName(nameArray, professorArray) {
  // console.log(nameArray);
  // console.log(profList);
  let hyphenLast = nameArray[nameArray.length - 2].concat("- ", nameArray[nameArray.length - 1]);
  let hyphenFirst = nameArray[nameArray.length - 2].concat("- ", nameArray[nameArray.length - 1]);
  for (var i = 0; i < professorArray.length; i++) {
    if (professorArray[i].tFname.toLowerCase() === nameArray[0].toLowerCase() && professorArray[i].tLname.toLowerCase() === nameArray[nameArray.length - 1].toLowerCase()) {
      console.log(professorArray[i]);
      return professorArray[i];
    } else if (professorArray[i].tFname.toLowerCase() === nameArray[0].toLowerCase() && professorArray[i].tLname.toLowerCase() === hyphenLast.toLowerCase()) {
      console.log(professorArray[i]);

      return professorArray[i];
      // console.log(temp);
    } else if (professorArray[i].tFname.toLowerCase() === nameArray[0].concat(" ").toLowerCase() && professorArray[i].tLname.toLowerCase() === nameArray[nameArray.length - 1].toLowerCase()) {
      console.log(professorArray[i]);

      return professorArray[i];
      // console.log(temp);
    }
  }
}

async function professorList() {
  let numOfPages = numOfProf / 20;

  let i = 1;
  while (i < numOfPages) {
    chrome.runtime.sendMessage(
      //goes to bg_page.js
      "https://www.ratemyprofessors.com/filter/professor/?&page=" + i + "&filter=teacherlastname_sort_s+asc&query=*%3A*&queryoption=TEACHER&queryBy=schoolId&sid=1253",
      (data) => {
        let arr = data.professors;
        arr.forEach((element) => profList.push(element));
        // profList.push(data.professors);
        console.log(profList);
      }
    );
    i += 1;
  }
}

setTimeout(function () {
  professorList();
}, 500);

function run() {
  var tableRef = $(".datadisplaytable");
  tableRef.find("tbody tr th:nth-child(20)").after("<th class=ddheader scope=col id=rateCol>Rating</th>");
  tableRef.find("tbody tr").each(function (i) {
    if (i > 1) {
      if ($(this).find("td:nth-child(20)").text() !== "TBA") {
        let name = $.trim($(this).find("td:nth-child(20)").text());
        let professor = name.replace("  ", " ");
        professor = professor.split(" ");
        if (professor[professor.length - 1] === "(P)") {
          professor.pop();
        }
        if (professor[professor.length - 1].includes("-")) {
          console.log(professor[professor.length - 1]);
          let temp = professor.pop();
          let tempArr = [];
          tempArr = temp.split("-");
          // professor.push(tempArr);
          tempArr.forEach((element) => professor.push(element));
          professor.splice(1, 1);
        }
        console.log(professor);

        let rating;
        let id;
        let professorProfile = searchName(professor, profList);
        if (professorProfile !== undefined) {
          rating = professorProfile.overall_rating;
          id = professorProfile.tid;
        }
        let level;
        switch (true) {
          case rating >= 4:
            level = "great";
            break;
          case rating >= 3:
            level = "good";
            break;
          case rating >= 2:
            level = "okay";
            break;
          case rating >= 1:
            level = "bad";
            break;
          case rating < 1:
            level = "awful";
            break;
          default:
            level = "dne";
            break;
        }
        console.log(rating);
        if (rating !== undefined) {
          $(this)
            .find("td:nth-child(20)")
            .after(
              "<td class=dddefault id=" + level + "><a class=rmpLink style='color:white !important;' href=https://www.ratemyprofessors.com/ShowRatings.jsp?tid=" + id + ">" + rating + "</a></td>"
            );
        } else {
          $(this)
            .find("td:nth-child(20)")
            .after("<td class=dddefault id=" + level + ">DNE</td>");
        }
      } else {
        $(this).find("td:nth-child(20)").after("<td class=dddefault id=rateRow>N/A</td>");
      }
    }
    // crosses out the classes that are closed
    if ($(this).find("td:nth-child(1)").text() === "C") {
      $(this).css("text-decoration", "line-through");
    }
  });
}
setTimeout(function () {
  run();
}, 1500);

// function searchProfessor() {}

// function replaceText(element) {
//   if (element.hasChildNodes()) {
//     element.childNodes.forEach(replaceText);
//   } else if (element.nodeType === Text.TEXT_NODE) {
//     if (element.textContent.match(/UNC/gi)) {
//       const newElement = document.createElement("span");
//       newElement.innerHTML = element.textContent.replace(/(UNC)/gi, '<span class="rainbow">$1</span>');
//       element.replaceWith(newElement);
//     }
//   }
// }

// tableRef.find("tbody tr td:nth-child(20)").after("<td class=dddefault id=rateRow>NR</td>");
