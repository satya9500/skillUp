const sqlstring = require("sqlstring");
const axios = require('axios');
const cheerio = require('cheerio');
const nodemailer = require("nodemailer");

module.exports = {
    register: async (req, res) => {

        let name = req.body.name;
        let username = req.body.username;
        let year = req.body.year;
        let techStack = req.body.techStack;
        let email = req.body.email;
        let mentor = req.body.mentor;
        let response;
        let contribution = 0;

        try {
            response = await axios.get(`https://api.github.com/users/${username}`);
            if (!response.data.login) { //throw new Error('User Not Found');   
                res.end({ success: false });
            } else {

                // let site = `https://github.com/users/${username}/contributions?to=2020-03-28`;
                // const result = await axios.get(site);
                // let data = cheerio.load(result.data);
                // data = data('body > div > div > h2').text();
                // console.log(data);
                // data = data.split(" ");
                // contribution = data[6];

                let query = `insert into Registration values (${sqlstring.escape(name)},${sqlstring.escape(username)},0,${sqlstring.escape(year)},${sqlstring.escape(techStack)},${sqlstring.escape(email)},${sqlstring.escape(mentor)},0);`;
                db.query(query, async (err, result) => {
                    if (err)
                        res.send({ success: false });
                    else {

                        var transporter = nodemailer.createTransport({
                            service: 'Gmail',
                            auth: {
                                user: process.env.GMAILEMAIL,
                                pass: process.env.GMAILPASSWORD
                            }
                        });
                        let info = await transporter.sendMail({
                            from: '"AIT CodeDown" <codedown2020@gmail.com>',
                            to: email,
                            subject: "CodeDown 2020",
                            html: `
            <h2>Congratulations!! You have registered for CodeDown 2020</h2>
            <b>This is an intra-AIT competition. You will be developing your projects in the given 30 days period.
                This has to be done on github, your contributions would be collected form github and you will also be
                awarded mentor points.<br>
                A leaderboard will be live for you to see your rank.<br>
                Older Contribution in github would be counted but main points will be considered for these 30 days.<br><br>
                Happy Coding!!<br>

                <table border="0" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;"><tr style=""><td height="28" style="line-height:28px;">&nbsp;</td></tr><tr><td style=""><table border="0" width="280" cellspacing="0" cellpadding="0" style="border-collapse:separate;background-color:#ffffff;border:1px solid #dddfe2;border-radius:3px;font-family:Helvetica, Arial, sans-serif;margin:0px auto;"><tr><td style="font-size:14px;font-weight:bold;padding:8px 8px 0px 8px;text-align:center;">ossDev</td></tr><tr><td style="color:#90949c;font-size:12px;font-weight:normal;text-align:center;">Public group · 3 members</td></tr><tr><td style="padding:8px 12px 12px 12px;"><table border="0" cellspacing="0" cellpadding="0" style="border-collapse:collapse;width:100%;"><tr><td style="background-color:#4267b2;border-radius:3px;text-align:center;"><a style="color:#3b5998;text-decoration:none;cursor:pointer;width:100%;" href="https://www.facebook.com/plugins/group/join/popup/?group_id=199364098179172&amp;source=email_campaign_plugin" target="_blank" rel="noopener"><table border="0" cellspacing="0" cellpadding="3" align="center" style="border-collapse:collapse;"><tr><td style="border-bottom:3px solid #4267b2;border-top:3px solid #4267b2;color:#FFF;font-family:Helvetica, Arial, sans-serif;font-size:12px;font-weight:bold;">Join Group</td></tr></table></a></td></tr></table></td></tr></table></td></tr><tr style=""><td height="28" style="line-height:28px;">&nbsp;</td></tr></table>
                <table border="0" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;"><tr style=""><td height="28" style="line-height:28px;">&nbsp;</td></tr><tr><td style=""><table border="0" width="280" cellspacing="0" cellpadding="0" style="border-collapse:separate;background-color:#ffffff;border:1px solid #dddfe2;border-radius:3px;font-family:Helvetica, Arial, sans-serif;margin:0px auto;"><tr><td style="font-size:14px;font-weight:bold;padding:8px 8px 0px 8px;text-align:center;">ossdev-workspace</td></tr><tr><td style="color:#90949c;font-size:12px;font-weight:normal;text-align:center;">Slack Group</td></tr><tr><td style="padding:8px 12px 12px 12px;"><table border="0" cellspacing="0" cellpadding="0" style="border-collapse:collapse;width:100%;"><tr><td style="background-color:#ff5050;border-radius:3px;text-align:center;"><a style="color:#ff5050;text-decoration:none;cursor:pointer;width:100%;" href="https://join.slack.com/t/ossdev-workspace/shared_invite/zt-d6kpend1-yA6SEoHDvGUrUt2U~lOvOA" target="_blank" rel="noopener"><table border="0" cellspacing="0" cellpadding="3" align="center" style="border-collapse:collapse;"><tr><td style="border-bottom:3px solid #ff5050;border-top:3px solid #ff5050;color:#FFF;font-family:Helvetica, Arial, sans-serif;font-size:12px;font-weight:bold;">Join Group</td></tr></table></a></td></tr></table></td></tr></table></td></tr><tr style=""><td height="28" style="line-height:28px;">&nbsp;</td></tr></table>


                For any queries Contact:<br>
                Email: codedown2020@gmail.com<br>
                Phone : 9325611554
            </b>
            `
                        });

                        res.send({ success: true });
                    }
                })
            }
        } catch (err) {
            console.log(err);
            res.send({ success: false });
        }

    },
    leaderboard: async (req, res) => {
        let query = 'select github_username,contributions,year,mentor_points from Registration;';
        try {
            db.query(query, (err, result) => {
                if (err) throw err;
                sortArrayOfObjects = (arr, key) => {
                    return arr.sort((a, b) => {
                        return b[key] - a[key];
                    });
                };
                sortArrayOfObjects(result.recordsets[0], "contributions");
                res.send({ success: result.recordsets })
            })
        } catch (err) {
            console.log(err);
            res.send({ success: false });
        }
    },
    getLeaderboard: async (req, res) => {
        res.render('leaderboard');
    }
}

//https://githubcontriscrape.herokuapp.com/api/scrape