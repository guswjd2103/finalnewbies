const pup = require('puppeteer');

// export const crawler = 

module.exports = {
    crawler: async () => {
        try {
            const browser = await pup.launch({headless: true})
            const page1 = await browser.newPage();
            //console.log("why")
            await page1.goto('https://98doci.com/product/list.html?cate_no=68');
            await page1.waitForSelector('.xans-element-.xans-product.xans-product-listnormal.ec-base-product')
            let result = new Array();
            /*console.log("asdv")
            const list = await page1.$$('.xans-element-.xans-product.xans-product-listnormal.ec-base-product');
            if (list) {
                console.log(list)
            }
            console.log("asdv")
            // result.push()*/
            const sections = await page1.$$(".xans-element-.xans-product.xans-product-listnormal.ec-base-product> ul > li");
            // console.log(sections.length);
            let result1 = [];
            for(const section of sections){
                const title = await section.$eval('.description > strong > a > span:nth-child(2)', span =>span.innerHTML
                )
                //console.log(title)
                const src = await section.$eval('div.prdImg > a> img', img => img.getAttribute("src"))
                const price = await section.$eval('.description > ul > li:nth-child(1) > span:nth-child(2)', span =>span.innerHTML)
                const linkpage = await section.$eval('div.description > strong > a', a => a.getAttribute("href"))
                result1.push({title, src, price, linkpage :`https://98doci.com${linkpage}`})
            }
            result.push(result1)

            const page2 = await browser.newPage();
            //console.log("why")*/
            await page2.goto('http://lalabong.co.kr/product/list.html?cate_no=170');
            await page2.waitForSelector('div.xans-element-.xans-product.xans-product-listnormal.ec-base-product')  
            
            const sections2 = await page2.$$('div.xans-element-.xans-product.xans-product-listnormal.ec-base-product > ul > li');
            // console.log(sections.length);
            let result2 = [];
            for(const section of sections2){
                //console.log("a")
                const title2 = await section.$eval('div.description > p.name > a > span:nth-child(2)', span =>span.innerHTML
                )
                //console.log(title2)
                const src2 = await section.$eval('.thumbnail > a> img', img => img.getAttribute("src"))
                const price2 = await section.$eval( 'div.description > ul > li:nth-child(2) > span:nth-child(2)', span =>span.innerHTML)
                const linkpage2=await section.$eval('div.thumbnail > a',a => a.getAttribute("href"))
                //console.log(linkpage)
                
                result2.push({title2, src2, price2, linkpage2: `http://lalabong.co.kr${linkpage2}`})
            }
            result.push(result2)
            
            return result;
        } catch (error) {
            console.log(error)
            return [];
        } 
      
    }       
}