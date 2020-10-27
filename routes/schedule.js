const schedule = require('node-schedule')
const cp = require('child_process')
const iconv = require('iconv-lite');
const fs = require('fs');


const cmd = "mongodump -h 127.0.0.1:27017 -d elective -o D:\\mongodump"
const path = "D:\\mongodump\\log\\elective"

const oldpath = "D:\\mongodump\\elective"
const date = (new Date()).toJSON().slice(0, 10)

const time = (new Date()).toTimeString().slice(0, 2)
const newpath = oldpath + '-' + date + '-' + time
console.log(time)
console.log(date)
console.log(newpath)

function scheduleCronstyle() {
    schedule.scheduleJob('0 0 23 * * 7', function () {
        cp.exec(cmd, { encoding: 'buffer' }, (error, stdout, stderr) => {
            if (error) {
                throw error
            } else {
                stdout = iconv.decode(stdout, 'gbk');
                stderr = iconv.decode(stderr, 'gbk');
                console.log(stdout)
                console.log(stderr)
                fs.rename(oldpath, newpath, (err) => {
                    if (err) {
                        throw err
                    }
                    console.log('重命名完成')
                })
                //成功之后写入日志
                let year = (new Date()).getFullYear();//获取年
                let month = ((new Date()).getMonth() + 1) > 9 ? ((new Date()).getMonth() + 1) : '0' + ((new Date()).getMonth() + 1);
                let date = (new Date()).getDate() > 9 ? (new Date()).getDate() : '0' + (new Date()).getDate();
                let hour = (new Date()).getHours() > 9 ? (new Date()).getHours() : '0' + (new Date()).getHours();
                let minute = (new Date()).getMinutes() > 9 ? (new Date()).getMinutes() : '0' + (new Date()).getMinutes();
                let seconds = (new Date()).getSeconds() > 9 ? (new Date()).getSeconds() : '0' + (new Date()).getSeconds();
                let str = `${year}-${month}-${date} ${hour}:${minute}:${seconds} 备份`
                fs.writeFile(path, `\n${str}`, { flag: 'a+' }, (err) => {
                    if (err) {
                        console.log(err)
                    }
                })
            }

        })
    });
}



module.exports = {
    date, oldpath, newpath, scheduleCronstyle: scheduleCronstyle()
}
