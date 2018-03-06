let mysql = require('mysql');
let moment = require('moment');
const rp = require('request-promise');
const {Facebook, FacebookApiException} = require('fb');
const FB = new Facebook();
let cheerio = require('cheerio');

let connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: '23136_database',
    port: 3307,
    charset: 'utf8mb4'
});

connection.connect(function(err) {
    if (err)
        throw err;
    else {
        console.log('Connected to MySQL');


    }
    FB.api('me/feed', { fields: 'insights.metric(post_impressions_unique),id,message,created_time,link',limit: 100, access_token:'EAADGAMZAy2GEBAAwvU3a9KSohZBh2ZAktKTZBYvM095xFSaZCHkXj05UeZCLFLTZCFhVLU6dvDAI6ZAP6hKgRSbPssOtn8YaZAISrSodkZA5zSAZBYVnngov6gYR7TYSg0jviqTPViHs6Y5QKUD0aER54pXTvNxRHo0HXBZCD2x6nHX7GgZDZD' }, function (res) {
       let stringify = JSON.stringify(res.data);
       let parsed = JSON.parse(stringify);
       




        for (let i = 0; i < parsed.length; i++) {
            let pushtest = [];
            let test = JSON.stringify(parsed[i].insights);
            let test2 = JSON.parse(test);
            // console.log(test2);
            let test3 = JSON.stringify(test2.data);
let test2data = JSON.parse(test3);
            for (let j = 0; j < test2data.length; j++) {

                let idk = JSON.stringify(test2data[j].values);
                let idc = JSON.parse(idk);
               pushtest.push(idc[j].value);

            }


            let time = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');

            let data = [


                [0,parsed[i].id,parsed[i].link,parsed[i].message,parsed[i].created_time,pushtest,'Facebook',time]


            ];

            let sql = "INSERT INTO stats_socials (ss_m_id,ss_id_soc,ss_postlink,ss_text,ss_date,ss_aantal,ss_type,ss_last_update) VALUES ? ON DUPLICATE KEY UPDATE ss_id_soc=ss_id_soc";
            connection.query(sql, [data], function (err, result) {
                if (err) throw err;
                console.log("The following number of rows have been added" + result.affectedRows);
            });

        }
    });

});
