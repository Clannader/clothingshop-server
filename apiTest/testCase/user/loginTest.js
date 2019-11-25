/**
 * Create by CC on 2019/9/14
 */
'use strict';
const BaseTest = require('../BaseTest');

class LoginTest extends BaseTest{

    /**
     * @description 测试不以api开头的地址,404不存在
     */
    async testNoFound(){
        const [err] = await this.http.fn(this.http.get('/user/getUserList'));
        this.equalResult(err && err.code === 404);
    }

    /**
     * @description 测试以api开头的地址,404不存在
     */
    async testNoFoundApi(){
        let params = {
            old_share:['1111','2222'],
            new_share:['3333']
        }
        const [err] = await this.http.fn(this.http.get('/api/getUserList', params));
        this.equalResult(err && err.code === 404);
        await this.logOut();
    }

    /**
     * 测试数据库没有supervisor,可以登录成功
     */
    async testNoSuperLogin(){
        const params = {
            adminId: 'supervisor',
            adminPws: this.getSHA256('s')
        };
        //TODO 删除supervisor
        const [err, res] = await this.http.fn(this.http.post('/api/user/login', params));
        this.equalResult(res && res.code === 1);
        if (res && res.code === 1) {
            this.config.write('session', res['credential'])
        }
        await this.logOut()
    }

    async initCase(){
        // await this.testNoFound();
        // await this.testNoFoundApi();
        // await this.testNoSuperLogin();
        this.http.fn(this.http.get('/api/test/lang/EN'), false).then(res =>{
            console.log('EN:')
            console.log(res)
        });
        this.http.fn(this.http.get('/api/test/lang/CH'), false).then(res =>{
            console.log('CH:')
            console.log(res)
        });
        this.http.fn(this.http.get('/api/about_cms'), false).then(res =>{
            console.log(res)
        });
    }
}

/**
 * 1.用户新增创建时间,锁定时间,有效期使用时间
 * 2.新增锁表,编辑用户时要判断是否被锁,如果用户没解锁,10分钟自动解锁
 * 3.新增输错密码5次,锁定用户,过10分钟才能解锁
 * 4.新增参数表,开参数校验复杂密码
 * 5.新增权限组换算方式,店铺组换算
 * 6.新增删除权限组时,判断是否有用户再用,店铺组也一样
 * 7.权限组名称只能英文
 * 8.权限组新增系统默认组标识,默认最前面,或者新增优先级排序,系统默认组靠前,后面的是自己新增的
 * 9.研究多进程缓存类使用,缓存类使用独立对象√
 * 10.翻译内容可能要替换,使用英文做key,加载方式和vue一直,翻译函数逻辑替换
 * 11.研究语言类型的一致性
 */

const login = new LoginTest();
login.start();