---
**-----逝者如斯夫，不舍昼夜-----**
#**showBox 插件使用方法**

**功能介绍**

----
主要用于WEB端 弹出提示 
	 

**代码使用**

# html
 `<button id="aa" class="qiuyan">aa</button><br />
<button id="bb" class="qiuyan">bb</button><br />
<button id="cc" class="qiuyan">cc</button>` 
		 
# JS		 
	$(function(){
			$("#aa").click(function(){
				Showbo.Msg.confirm('请上传图片', '温馨提示', '确定','取消',function(flag){
						if(flag =="yes"){
							return false;//点击 确定以后 不关闭
							return true;//关闭
						}
					})
			})
			$("#bb").click(function(){
				Showbo.Msg.alert('请上传图片!', '温馨提示', '确定', 1e5)
				})
			$("#cc").click(function(){
				Showbo.Msg.alert('请上传图片', '温馨提示', '确定', 1e5);
			})
		 })
		 

    
 
		
 