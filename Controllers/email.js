const nodemailer=require('nodemailer')
const pug=require('pug')
const htmlToText=require('html-to-text');

module.exports=class Email{
    constructor(user,url,foodname){
        this.to=user.email;
        this.food=foodname;
        this.Firstname=user.first_name;
        this.url=url;
        this.from=`DSC SCET<${process.env.EMAIL}>`
    }

    newTransport(){
        // // console.log('inside email3')
        // if(process.env.NODE_ENV==='devlopment'){
          
            
            // return nodemailer.createTransport({
            //     host:process.env.EMAIL_HOST,
            //     prot:process.env.PORT,
            //     auth:{
            //         user:process.env.EMAIL_USERNAME,
            //         pass:process.env.EMAIL_PASSWORD
            //     }
            // })
        
        // console.log('upside transport mail')
        return nodemailer.createTransport({
            host:process.env.GMail_HOST,
                prot:process.env.GMAIL_PORT,
            auth:{
                user:process.env.MYMAIL,
                pass:process.env.MYMAIL_PASSWORD
            }
        })
    }
  async  send(templet,subject){
        // we want to create html pug
         const html=pug.renderFile(`${__dirname}/../views/emails/${templet}.pug`,{
             Firstname:this.Firstname,
             food:this.food,
             url:this.url,
             subject
         })
        // create mail
        const mailOption={
            from:`${process.env.MYMAIL}`,
            to:this.to,
            subject,
            html,
            text:htmlToText.fromString(html)
            // html
        }
        // console.log('inside email 2')
    // send mail
   console.log('working')
   await this.newTransport().sendMail(mailOption)
   
    


    }
async welcomeMail(){
 await   this.send("Verification",'Thank you for join with US')
//  console.log('inside email 1')
}
async passwordEmail(){
    await this.send('ForgotPaswword','Reset Password')
}
async verificationMail(){
    await this.send("ForgotPaswword",'Verifiction Account')
}
}
