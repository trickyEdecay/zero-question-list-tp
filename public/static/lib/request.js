class Request{
    static get(url,data={}){
        return new Promise((resolve,reject)=>{
            $.ajax({
                url,
                type:"get",
                data,
                success:(response)=>{
                    resolve(response);
                },
                error:(response)=>{
                    reject(response);
                }
            });
        });
    }

    static post(url,data={}){
        return new Promise((resolve,reject)=>{
            $.ajax({
                url,
                type:"post",
                data,
                success:(response)=>{
                    resolve(response);
                },
                error:(response)=>{
                    reject(response);
                }
            });
        });
    }
}

export default Request;