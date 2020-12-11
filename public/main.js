/* 근무 짜는 프로그램*/
'use strict';

{
    let weekday = 5;
    let week = 7;
    let shift = [];
    let members = [];
    let weekShiftsTotal = 0;
    // sheet
    let person = ["길윤재", "황중현", "이근혁", "서동휘", "나종원", "박시현", "이관진", "임석범", "황인성", "류희성", "복병수", "김민수", "김종훈", "김정현", "백지용", "홍우진", "김민수2", "김수환", "김승진", "손건우", "강우석", "송강산", "김석희", "김선규", "박태규", "공민식", "오도경", "홍성원", "최현준", "권오복", "최재성", "김창민", "이영한" , "박준서", "김수원", "김건호", "강건호", "이정원"];
    let shiftId = 0;
    // re
    let numberNightShift = 4; // 불침번 근무 개수
    let numberCctvShift = 10; // cctv 근무 개수
    let btnSetShift = document.getElementById('setShift');

    function work(id, number, name, score, day, who) //re number 필요한가?(검색했을때 쓰이는 곳 없음)
    {
        this.id = id;
        this.number = number;
        this.name = name;
        this.score = score;
        this.day = day;
        this.who = who;
    }

    function info(id, name, score, cnt, day, sum)
    {
        this.id = id;
        this.name = name
        this.score = score;
        this.count = cnt;
        this.worked = [];
        this.workId = [];
        this.day = day;
        this.sum = sum;
    }

    for(let i = 0; i < week; i++)
    {
        // re
        let shiftName = ["04", "06", "08", "10", "12", "14", "16", "18", "20", "22", "first", "second", "third", "fourth", "guardhouse1", "guardhouse2"]; // Server data
        let weekdayShiftScore = [3, 2, 2, 1, 2, 1, 1, 3, 2, 2, 1, 2, 3, 2]; // Server data
        let friShiftScore = [3, 2, 2, 1, 2, 1, 1, 3, 2, 2, 1, 1, 3, 2]; // Server data
        let satShiftScore = [2, 2, 2, 2, 2, 3, 3, 3, 3, 1, 1, 1, 2, 2, 3, 3]; // Server data
        let sunShiftScore = [2, 2, 2, 3, 3, 3, 2, 3, 2, 2, 2, 2, 3, 2, 3, 3]; // Server data
        let aDayShiftsTotal = numberNightShift + numberCctvShift
        aDayShiftsTotal = (i < weekday) ? aDayShiftsTotal : aDayShiftsTotal + 2; // 주말 위병소 근무 때문에
        shift[i] = new Array(aDayShiftsTotal);

        if(i < weekday - 1) // Monday ~ Thursday
        {
            for(let j = 0; j < aDayShiftsTotal; j++)
            {
                shift[i][j] = new work(shiftId, weekShiftsTotal, shiftName[j], weekdayShiftScore[j], i, "");
                weekShiftsTotal++;
                shiftId++;
            }
        }
        else if(i === weekday - 1) // Friday
        {
            for(let j = 0; j < aDayShiftsTotal; j++)
            {
                shift[i][j] = new work(shiftId, weekShiftsTotal, shiftName[j], friShiftScore[j], i, "");
                weekShiftsTotal++;
                shiftId++;
            }
        }
        else if(i === weekday) // Satday
        {
            for(let j = 0; j < aDayShiftsTotal; j++)
            {
                shift[i][j] = new work(shiftId, weekShiftsTotal, shiftName[j], satShiftScore[j], i, "");
                weekShiftsTotal++;
                shiftId++;
            }
        }
        else // Sunday
        {
            for(let j = 0; j < aDayShiftsTotal; j++)
            {
                shift[i][j] = new work(shiftId, weekShiftsTotal, shiftName[j], sunShiftScore[j], i, "");
                weekShiftsTotal++;
                shiftId++;
            }
        }
    }

    function loadMembers(zeroPoint) // 나중에 엑셀
    {
        let tempPerson = person;
        if(!members.length)
        {
            for(let i = 0; i < tempPerson.length; i++)
            {
                members[i] = new info(i, tempPerson[i], 0, 0, 0, 0);
                zeroPoint[i] = members[i];    
            }
        }
        else if(members.length < tempPerson.length) // 추가 되었을때 (휴가복귀)
        {
            for(let i = 0; i < tempPerson.length; i++)
            {
                for(let j = 0; j < members.length; j++)
                {
                    if(tempPerson[i] === members[j].name)
                    {
                        tempPerson.splice(i, 1);
                        break;
                    }
                }
            }

            for(let i = 0; i < tempPerson.length; i++)
            {
                tempPerson[i] = new info(members.length, tempPerson[i], 0, 0, 0, 0);
                members.push(tempPerson[i]);
                zeroPoint.push(tempPerson[i]);
            }
        }
        else if(members.length > person.length) // 휴가 나감
        {
            let tempMembersArray = members;
            let cnt = 0;
            for(let i = 0; i < tempMembersArray.length; i++)
            {
                for(let j = 0; j < tempPerson.length; j++)
                {
                    if(tempMembersArray[i].name === tempPerson[j])
                    {
                        tempMembersArray.splice(i, 1);
                        break;
                    }
                }
            }

            for(let i = 0; i < members.length; i++)
            {
                for(let j = 0; j < tempMembersArray.length; j++)
                {
                    if(members[i].id === tempMembersArray[j].id)
                    {
                        members.splice(i , 1);
                        cnt++;
                    }
                }
                if(cnt === tempMembersArray.length)
                {
                    break;
                }
            }
        }
        else // 휴가 복귀자랑 출발자 수가 똑같은면?
        {
            return;
        }
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////*** 근무 및 인원 초기화 끝

    function controlInfo(selectedPeople, shift)
    {
        let workedCnt = selectedPeople.worked.length;
        let workIdCnt = selectedPeople.workId.length;

        selectedPeople.score = shift.score;
        selectedPeople.sum += shift.score;
        selectedPeople.day = shift.day;
        selectedPeople.count++;
        selectedPeople.worked[workedCnt] = shift.name;
        selectedPeople.workId[workIdCnt] = shift.id;
    }

    function checkPossiblePeople(day)
    {
        let possible = [];
        let len = members.length;
        let maxCount = Math.ceil(weekShiftsTotal / len);

        // Check Possible
        for(let i = 0; i < len; i++)
        {
            if(members[i].count >= maxCount)
            {
                continue;
            }
            else if(members[i].count === 0) // 이거 나중에 매일 loadMemebers 호출하면 필요 없어질듯????
            {
                possible.push(members[i]);
            }
            else if(day - members[i].day < 2) // 근무 후 적어도 하루는 쉰다는 규칙이 있을때만 적용, 후에 2을 변수로 변경, 인원들이 전부 한번씩 해도 이틀치 근무를 못 채우면 문제 발생
            {
                continue;
            }
            else
            {
                possible.push(members[i]);
            }
        }
        
        return possible;
    }

    function checkLessWorkers(selectedPeople)
    {
        let leastCnt = 3;
        let less = [];
        for(let i = 0; i < selectedPeople.length; i++) // 가장 적게 한 횟수 구함
        {
            if(selectedPeople[i].count < leastCnt)
            {
                leastCnt = selectedPeople[i].count;
                if(leastCnt === 1) // 0은 여기 올 수 없음 그러니 가장 작은 1이 나오면 더 볼 것도 없음
                {
                    break;
                }
            }
        }

        for(let i = 0; i < selectedPeople.length; i++) // 가장 적게 한 인원들 구함
        {
            if(leastCnt === selectedPeople[i].count)
            {
                less.push(selectedPeople[i]);
            }
        }
        return less;
    }

    function pickAndControlInfo(selectedPeople, shift)
    {
        let randomPerson = 0;
        let pass = false;
        let repeatCnt = 0;
        let pickedPerson = [];

        if(shift.score === 2) // 2점 근무는 이전에 무슨 근무를 했던지 상관없이 들어감
        {
            randomPerson = Math.floor(Math.random() * selectedPeople.length - 1) + 1;
        }
        else
        {
            if(shift.day === 6) // 이거를 checkPossible로 옮겨야 함
            {
                let oneCntMember = []; // 마지막 날인 일요일 까지 한번 사람이 있다면 그사람 먼저
                for(let i = 0; i < members.length; i++)
                {
                    if(members[i].count === 1)
                    {
                        oneCntMember.push(members[i]);
                    }
                }

                if(oneCntMember.length)
                {
                    // debugger;
                    selectedPeople = null; // Bug 1 : 기존에 possiblePeople에서는 못 지움
                    selectedPeople = oneCntMember;
                }
            }

            while(!pass)
            {
                randomPerson = Math.floor(Math.random() * selectedPeople.length - 1) + 1;
        
                if(selectedPeople[randomPerson].score === shift.score)
                {
                    if(pickedPerson.length)
                    {
                        let isSameNumber = false;

                        for(let i = 0; i < pickedPerson.length; i++)
                        {
                            if(pickedPerson[i] === randomPerson)
                            {
                                isSameNumber = true;
                                break;
                            }
                        }

                        if(!isSameNumber)
                        {
                            pickedPerson.push(randomPerson);
                            repeatCnt++;
                        }
                    }
                    else
                    {
                        pickedPerson.push(randomPerson);
                        repeatCnt++; // 중복되는 숫자가 나오면 카운트 하지 말아야함
                    }
                    pass = false;

                    if(repeatCnt === selectedPeople.length) // 모든 사람의 점수가 같은 경우 가장 적게 일한 사람들 중에서 픽함 // 위험 // 위에 oneCntMember랑 충돌 하는지?
                    {
                        // debugger;
                        if(pickedPerson.length === 1)
                        {
                            pass = true;
                        }
                        else
                        {
                            let temp = [];
                            temp = checkLessWorkers(selectedPeople);
                            selectedPeople = temp;
                            randomPerson = Math.floor(Math.random() * selectedPeople.length - 1) + 1;
                            pass = true;
                        }
                    }
                }
                else
                {
                    pass = true;
                }
            }
        }

        let todaySlave = selectedPeople[randomPerson].name;
        controlInfo(selectedPeople[randomPerson], shift);
        selectedPeople.splice(randomPerson, 1); // Bug 1

        return todaySlave;
    }

    function checkFair()
    {
        let variance = 0;
        let deviation = 0;
        let squared = 0;
        let totalScore = 0;
        let avg = 0;
        let hardWorkers = [];
        let easyWokers = [];

        for(let i = 0; i < members.length; i++)
        {
            totalScore += members[i].sum;

            if(members[i].sum > 7) // 숫자는 나중에 변수로
            {
                hardWorkers.push(members[i]);
            }
            else if(members[i].sum < 4) // 숫자는 나중에 변수로
            {
                easyWokers.push(members[i]);
            }
        }

        avg = totalScore / members.length;
        avg = avg.toFixed(1);
        avg *= 1;
        
        // 표준편차
        for(let i = 0; i < members.length; i++)
        {
            squared = 0;
            squared = members[i].sum - avg;
            squared *= squared;
            deviation += squared;
        }

        variance = deviation / members.length;
        console.log("-------------------------------------------");
        console.log(`분산 값 : ${variance}`);
        console.log("-------------------------------------------");
        console.log(`Hard worker 총 인원 : ${hardWorkers.length}`);

        for(let i = 0; i < hardWorkers.length; i++)
        {
            console.log(`name: ${hardWorkers[i].name}, count ${hardWorkers[i].count}, sum : ${hardWorkers[i].sum}`);
        }

        console.log("-------------------------------------------");
        console.log(`easy worker 총 인원 : ${easyWokers.length}`);

        for(let i = 0; i < easyWokers.length; i++)
        {
            console.log(`name: ${easyWokers[i].name}, count: ${easyWokers[i].count}, sum : ${easyWokers[i].sum}`);
        }

        console.log("-------------------------------------------");
    }

    function createData(shift)
    {
        // re
        let shiftName = ["04", "06", "08", "10", "12", "14", "16", "18", "20", "22", "first", "second", "third", "fourth", "guardhouse1", "guardhouse2"]; // Server data

        let  data =
        {
            headers: ["요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일", "일요일"],
            rows: Array.from(Array(shiftName.length), () => Array(week).fill(null))
        }

        for(let i = 0; i < week; i++)
        {
            for(let j = 0; j < shift[i].length; j++)
            {
                data.rows[j][i] = shift[i][j].who;
            }
        }

        // data.rows[n][0]은 근무이름
        for(let i = 0; i < data.rows.length; i++)
        {
            data.rows[i].unshift(shiftName[i]);
        }

        return data;
    }

    function main() // Change name (ex: shifting?)
    {
        let zeroPointMembers = [];
        loadMembers(zeroPointMembers); // 나중에 휴가자들

        // pick 함수 호출했을때 table 만들기 좋게
        for(let i = 0; i < week; i++)
        {
            let numberNightShift = 4; // Server data
            let numberCctvShift = 10; // Server data
            let todayWorker = []; // re
            let yoill = ["Mon", "Tue", "Wed", "Thr", "Fri", "Sat", "Sun"];
            let aDayShiftsTotal = numberNightShift + numberCctvShift;
            aDayShiftsTotal = (i < weekday) ? aDayShiftsTotal : aDayShiftsTotal + 2; // 이것도 수정 해야함
            let possiblePeople = [];
            let day = i;

            if(zeroPointMembers.length)
            {
                for(let j = 0; j < aDayShiftsTotal; j++)
                {
                    if(!zeroPointMembers.length)
                    {
                        possiblePeople = checkPossiblePeople(day);
                        for(let k = j; k < aDayShiftsTotal; k++)
                        {
                            todayWorker[k] = pickAndControlInfo(possiblePeople, shift[i][k]);
                            shift[i][k].who = todayWorker[k];
                        }
                        break;
                    }
                    else
                    {
                        todayWorker[j] = pickAndControlInfo(zeroPointMembers, shift[i][j]);
                        shift[i][j].who = todayWorker[j];
                    }
                }
            }
            else
            {
                possiblePeople = checkPossiblePeople(day);
                for(let j = 0; j < aDayShiftsTotal; j++)
                {
                    todayWorker[j] = pickAndControlInfo(possiblePeople, shift[i][j]);
                    shift[i][j].who = todayWorker[j];
                }
            }
            console.log(`${yoill[i]} : ${todayWorker}`);
        }

        checkFair();
        
        console.log(shift);
        // Create data
        const data = createData(shift);
        console.log(data);

        renderingTable(data);
    }

    function renderingTable(data)
    {
        const root = document.querySelector('.table-shift');

        const table = document.createElement('table');
    
        table.classList.add('table-shift__table');
        
        table.innerHTML = `
            <thead>
                <tr></tr>
            </thead>
            <tbody>
                <tr>
                    <td></td>
                </tr>
            </tbody>
        `;
    
        root.append(table);

        table.querySelector('thead tr').textContent = "";
        table.querySelector('tbody').textContent = "";

        for(const header of data.headers)
        {
            table.querySelector('thead tr').insertAdjacentHTML('beforeend', `<th>${header}</th>`);
        }

        for(const row of data.rows)
        {
            table.querySelector('tbody').insertAdjacentHTML('beforeend', `
                <tr>
                    ${ row.map(col => `<td>${ col }</td>`).join("") }
                </tr>
            `)
        }
    }

    btnSetShift.addEventListener("click", () =>
    {
        main();
    });
}