/* 근무 짜는 프로그램*/
'use strict';

exports.draw_member = (membersData, shiftInfo) =>
{
    const WEEK = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
    const WORK_INFO = shiftInfo.work_info;
    const RELATION = shiftInfo.relation;
    const LAST_DRAW = shiftInfo.lastDraw;
    let members = [];
    let thisWeek = [];

    class member
    {
        constructor(rank, name, priority, count, date, join, ban, time, worked, weekday, weekend)
        {
            this.rank = rank;
            this.name = name;
            this.priority = priority;
            this.count = count;
            this.date = date;
            this.join = join;
            this.ban = ban;
            this.time = time;
            this.worked = worked;
            this.weekday = weekday;
            this.weekend = weekend;
        }

        controlInfo(work)
        {
            let workName = `${work.name}${work.time}`;
            this.count++;
            this.date = work.date;
            this.worked.push(workName);
            this.priority = false;

            if(work.duo)
            {
                work.who.push(`${this.rank} ${this.name}`);
            }
            else
            {
                work.who = `${this.rank} ${this.name}`;
            }
        }
    }

    function regxBanTime(pTime)
    {
        let times = [];
        let reg = /(\d{2})[ :]\d{2}[ ~ ]{1,3}(\d{2}):\d{2}/g;
        let result = reg.exec(pTime);
        let banStartTime = Number(result[1]);
        let banEndTime = Number(result[2]);

        while(true)
        {
            let bTime = (banStartTime < 10) ? `0${banStartTime}` : String(banStartTime);
            times.push(bTime);
            banStartTime++;
            banStartTime = (banStartTime >= 24) ? 0 : banStartTime;

            if(banStartTime === banEndTime)
            {
                break;
            }
        }

        return times;
    }

    function initMembersData()
    {
        for(let person of membersData)
        {
            let rank = person.계급;
            let name = person.이름;
            let priority = false;
            let count = 0;
            let date = (person.date) ? person.date : 0;
            let join = person.입대일;
            let ban = (person.ban) ? person.ban.split(" ") : [];
            let time = (person.시간) ? regxBanTime(person.시간) : [];
            let worked = (person.worked.length) ? person.worked : [];
            let weekday = person.평일.split(" ");
            let weekend = person.주말.split(" ");

            person = new member(rank, name, priority, count, date, join, ban, time, worked, weekday, weekend);
            members.push(person);
        }
    }

    initMembersData();

    // Get thisweek
    function createThisWeek()
    {
        let lastDrawDate;
    
        if(LAST_DRAW === null)
        {
            let now = new Date();
            let year = now.getFullYear();
            let month = now.getMonth();
            let date = now.getDate();
            let dayOfWeek = now.getDay();
            let diff = 7 - dayOfWeek;

            date += diff;
            lastDrawDate = new Date(year, month, date);
        }
        else
        {
            lastDrawDate = new Date(LAST_DRAW);
        }
        
        let nextRenderWeek = lastDrawDate;
    
        for(let i = 0; i < 7; i++)
        {
            nextRenderWeek.setDate(nextRenderWeek.getDate() + 1);
            let year = nextRenderWeek.getFullYear();
            let month = Number(nextRenderWeek.getMonth()) + 1;
            let date = nextRenderWeek.getDate();
            let day = nextRenderWeek.getDay();

            thisWeek[i] = {
                date: `${year}-${month}-${date}`,
                day: WEEK[day]
            };
        }
    }
    
    createThisWeek();

    // Set Object shift
    let shift = {};

    for(const dayOfWeek of thisWeek)
    {
        shift[`${dayOfWeek.day}`] = [];
    }

    function setDayOfWeekArry(day, dayOfWeek)
    {
        let value ={};
        let workMinute = "00";
        let workTime = "";
        let weekInfo = "";      //re Change name

        switch(dayOfWeek)
        {
            case 'sat':
                weekInfo = "weekend";
                break;
            case 'sun':
                weekInfo = "weekend";
                break;
            default:
                weekInfo = "weekday";
                break;
        }

        for(const work of WORK_INFO[weekInfo])
        {
            for(let i = 0; i < work.num; i++)
            {
                let startTime = work.firstWorkTime + i * work.timeInterval;
                let endTime = startTime + work.timeInterval;
                startTime = (startTime >= 24) ? startTime -= 24 : startTime;
                endTime = (endTime >= 24) ? endTime -= 24 : endTime;

                if(startTime % 1) // decimal
                {
                    workMinute = "30"; // re
                    startTime = Math.floor(startTime);
                    endTime = startTime + work.timeInterval;
                    startTime = (startTime / 10 < 1) ? `0${startTime}` : String(startTime);
                    workTime = `${startTime}:${workMinute} ~ ${startTime + work.timeInterval}:${workMinute}`;
                }
                else
                {
                    startTime = (startTime / 10 < 1) ? `0${startTime}` : String(startTime);
                    endTime = (endTime / 10 < 1) ? `0${endTime}` : String(endTime);
                    workTime = `${startTime}:${workMinute} ~ ${endTime}:${workMinute}`;
                }
                
                value = {name: work.workName, time: workTime, date: thisWeek[day].date, day: dayOfWeek, duo: work.duo};
                value.who = (work.duo) ? [] : "";

                shift[dayOfWeek].push(value);
            }
        }

        if(RELATION !== null)
        {
            for(let i = 0; i < shift[dayOfWeek].length; i++)
            {
                if(RELATION[weekInfo][i])
                {
                    shift[dayOfWeek][i].relation = RELATION[weekInfo][i];                
                }
            }
        }
    }

    function setShift()
    {
        let day = 0;

        for(let dayOfWeek in shift)
        {
            setDayOfWeekArry(day, dayOfWeek);
            day++;
        }
    }

    setShift();

    let weeklyTotalShifts = 0;
    let numOfWeek = 0;
    let numOfWeekend = 0;

    for(let week in WORK_INFO)
    {
        switch(week)
        {
            case 'weekday':
                for(let type of WORK_INFO[week])
                {
                    if(type.duo)
                    {
                        numOfWeek += (type.duo * type.num);
                    }
                    else
                    {
                        numOfWeek += type.num;
                    }
                }

                numOfWeek *= 5;
                break;
            case 'weekend':
                for(let type of WORK_INFO[week])
                {
                    if(type.duo)
                    {
                        numOfWeekend += (type.duo * type.num);
                    }
                    else
                    {
                        numOfWeekend += type.num;
                    }
                }

                numOfWeekend *= 2;
                break;
        }
    }

    weeklyTotalShifts = numOfWeek + numOfWeekend;

    function checkPossibleMembers(date)
    {
        let possible = [];
        let weeklyMaxCount = Math.ceil(weeklyTotalShifts / members.length);
        let numOfWorked = 0;
        let minDayOff = Math.floor(7 / weeklyMaxCount);

        // How many members should have worked
        for(let dayOfWeek in shift)       //refactoring
        {
            if(shift[dayOfWeek][0].date === date)
            {
                break;
            }
            else
            {
                numOfWorked += shift[dayOfWeek].length;
            }
        }

        // let minCount = Math.floor(numOfWorked / members.length);
        let today = new Date(date);     // (일이 2자리수가 되면 시간이 09:00로됨, 1자리수 일은 00:00로 됨)
        today.setHours(0);
        let currentDate = today.getDate();

        // Check Possible members
        for(let member of members)
        {
            let dayOfMember = new Date(member.date);
            dayOfMember.setHours(0);
            let dayDiff = (today.getTime() - dayOfMember.getTime()) / (1000*60*60*24);

            if(member.count >= weeklyMaxCount || member[`${currentDate}`] || dayDiff < minDayOff)
            {
                continue;
            }
            else if(dayDiff > minDayOff)
            {
                member.priority = true;
                possible.push(member);
            }
            else if(member.time.length)
            {
                member.priority = true;
                possible.push(member);
            }
            else
            {
                possible.push(member);
            }
        }

        return possible;
    }

    function checkSub(targetMember, possibleMembers)
    {
        let possible = [];
        let targetMemberJoin = new Date(targetMember.join);
        targetMemberJoin.setHours(0);
        let pass = false;
        let minDiff = 120;

        // check right submembers
        while(!pass)
        {
            for(let member of possibleMembers)
            {
                let subMember = member;
                let subMemberJoin = new Date(subMember.join);
                subMemberJoin.setHours(0);
                let dateDiff = Math.abs( (targetMemberJoin.getTime() - subMemberJoin.getTime()) / (1000*60*60*24) );

                if(dateDiff < minDiff)
                {
                    continue;
                }
                else if(targetMember.ban === subMember.name || subMember.ban === targetMember.name)
                {
                    continue;
                }
                else
                {
                    possible.push(member);
                }
            }

            if(!possible.length)
            {
                pass = false;
                minDiff -= 10;
            }
            else
            {
                pass = true;
            }
        }

        return possible;
    }

    function pick(work, possibleMembers)
    {
        let randomPerson = 0;
        let selected = [];
        let priorityMembers = [];

        for(let member of possibleMembers)
        {
            if(member.priority)
            {
                priorityMembers.push(member);
            }
            else
            {
                selected.push(member);
            }
        }

        // Pick member
        if(priorityMembers.length)
        {
            randomPerson = Math.floor(Math.random() * priorityMembers.length - 1) + 1;
            priorityMembers[randomPerson].controlInfo(work);
            return priorityMembers[randomPerson];
        }
        else
        {
            randomPerson = Math.floor(Math.random() * selected.length - 1) + 1;
            selected[randomPerson].controlInfo(work);
            return selected[randomPerson];
        }
    }

    function pickMember(work, possibleMembers)
    {
        // alreadyHave re
        if(work.who !== "")
        {
            if(Array.isArray(work.who))
            {
                if(work.who.length !== 0)
                {
                    return;
                }
            }
            else // relation work
            {
                return;
            }
        }

        let possible = filteringMember(work, possibleMembers);
        let pickedMember = pick(work, possible);

        let index = possibleMembers.findIndex(member => member.name === pickedMember.name);
        possibleMembers.splice(index, 1);

        if(work.duo) // 그럼 duo가 연결 되어있을때는
        {
            index = possible.findIndex(member => member.name === pickedMember.name);
            possible.splice(index, 1);

            if(!possible.length)
            {
                possibleMembers = checkPossibleMembers(work.date);
                possible = filteringMember(work, possibleMembers);
            }

            possible = checkSub(pickedMember, possible);
            let subMember = pick(work, possible);
            let subIndex = possibleMembers.findIndex(member => member.name === subMember.name);
            possibleMembers.splice(subIndex, 1);
            
            // who's main?
            let targetMemberJoin = new Date(pickedMember.join);
            targetMemberJoin.setHours(0);
            let subMemberJoin = new Date(subMember.join);
            subMemberJoin.setHours(0);
            
            if(targetMemberJoin > subMemberJoin)
            {
                let temp = work.who[0];
                work.who[0] = work.who[1];
                work.who[1] = temp;
            }
        }

        // relation work
        if(work.relation)
        {
            let memName = `${pickedMember.rank} ${pickedMember.name}`;

            for(let dayOfWeek in shift)
            {
                if(shift[dayOfWeek][0].date === work.date)
                {
                    shift[dayOfWeek][work.relation].who = memName;
                    pickedMember.count++;
                }
            }
        }
    }

    function filteringMember(work, memberData)
    {
        let possible = [];
        let keepMember = [];
        let possibleWork;
        let workTimeReg = /(\d{2})[ :]\d{2}[ ~ ]{1,3}(\d{2}):\d{2}/g;
        let result = workTimeReg.exec(work.time);
        let workStartTime = result[1];
        let workName = `${work.name}${work.time}`;

        switch(work.day)
        {
            case 'sat':
                possibleWork = "weekend";
                break;
            case 'sun':
                possibleWork = "weekend";
                break;
            default:
                possibleWork = "weekday";
                break;
        }

        for(let member of memberData)
        {
            if(member.time.indexOf(workStartTime) >= 0 || member[possibleWork].indexOf(work.name) < 0)
            {
                continue;
            }
            else if(member.worked.indexOf(workName) >= 0)
            {
                keepMember.push(member);
                continue;
            }
            else
            {
                possible.push(member);
            }
        }

        if(!possible.length)
        {
            return keepMember;
        }
        else
        {
            return possible;
        }
    }

    function checkFair()
    {
        let maxMembers = [];
        let minMembers = [];
        let maxCount = Math.ceil(weeklyTotalShifts / members.length);
        let minCount = 0;
        
        console.log(`총 근무 : ${weeklyTotalShifts}`);
        console.log(`총 인원 : ${members.length}`);
        console.log(`최대 근무 횟수 : ${maxCount}`);

        if(weeklyTotalShifts % members.length > 0)
        {
            minCount = maxCount - 1;
            console.log(`최소 근무 횟수: ${minCount}`);
        }

        if(RELATION === null) // re 이걸로 미루어 보아 relation 근무는 count 하나로 봐야할듯 그러면 relatoin 있든 없든 다 계산 가능
        {
            let maxWorkerCount = weeklyTotalShifts % members.length;
            let minWorkerCount = members.length - maxWorkerCount;

            console.log(`최대 근무 근무자수 :${maxWorkerCount}`);
            console.log(`최소 근무 근무자수 :${minWorkerCount}`);
        }

        for(const member of members)
        {
            if(member.count >= maxCount)
            {
                maxMembers.push(member);
            }
            else if(member.count <= minCount)
            {
                minMembers.push(member);
            }
        }

        console.log("-------------------------------------------");
        console.log(`max worker 총 인원 : ${maxMembers.length}`);
        
        for(const worker of maxMembers)
        {
            console.log(`name: ${worker.name}, worked: ${worker.worked}`);
        }
        
        console.log("-------------------------------------------");
        console.log(`min worker 총 인원 : ${minMembers.length}`);
        console.log("-------------------------------------------");
        
        for(const worker of minMembers)
        {
            console.log(`name: ${worker.name}, worked: ${worker.worked}`);
        }
    }

    function main()
    {
        let possibleMembers = [];

        for(let dayOfWeek in shift)
        {
            possibleMembers = checkPossibleMembers(shift[dayOfWeek][0].date);

            // pick a memeber
            for(let work of shift[dayOfWeek])
            {
                if(!possibleMembers.length)
                {
                    possibleMembers = checkPossibleMembers(work.date);
                }

                pickMember(work, possibleMembers);
            }
        }

        checkFair();
    }

    main();

    const DATA = {
        shift_data: shift,
        week: thisWeek,
        members_data: members
    }

    return DATA;
}