typeof ShopifyAPI=="undefined"&&(ShopifyAPI={});function attributeToString(attribute){return typeof attribute!="string"&&(attribute+="",attribute==="undefined"&&(attribute="")),jQuery.trim(attribute)}ShopifyAPI.onCartUpdate=function(cart){},ShopifyAPI.updateCartNote=function(note,callback){var params={type:"POST",url:"/cart/update.js",data:"note="+attributeToString(note),dataType:"json",success:function(cart){typeof callback=="function"?callback(cart):ShopifyAPI.onCartUpdate(cart)},error:function(XMLHttpRequest2,textStatus2){ShopifyAPI.onError(XMLHttpRequest2,textStatus2)}};jQuery.ajax(params)},ShopifyAPI.onError=function(XMLHttpRequest,textStatus){var data=eval("("+XMLHttpRequest.responseText+")");data.message&&alert(data.message+"("+data.status+"): "+data.description)},ShopifyAPI.addItemFromForm=function(form,callback,errorCallback){var params={type:"POST",url:"/cart/add.js",data:jQuery(form).serialize(),dataType:"json",success:function(line_item){typeof callback=="function"?callback(line_item,form):ShopifyAPI.onItemAdded(line_item,form)},error:function(XMLHttpRequest2,textStatus2){typeof errorCallback=="function"?errorCallback(XMLHttpRequest2,textStatus2):ShopifyAPI.onError(XMLHttpRequest2,textStatus2)}};jQuery.ajax(params)},ShopifyAPI.getCart=function(callback){jQuery.getJSON("/cart.js",function(cart,textStatus2){typeof callback=="function"?callback(cart):ShopifyAPI.onCartUpdate(cart)})},ShopifyAPI.changeItem=function(line,quantity,callback){var params={type:"POST",url:"/cart/change.js",data:"quantity="+quantity+"&line="+line,dataType:"json",success:function(cart){typeof callback=="function"?callback(cart):ShopifyAPI.onCartUpdate(cart)},error:function(XMLHttpRequest2,textStatus2){ShopifyAPI.onError(XMLHttpRequest2,textStatus2)}};jQuery.ajax(params)};var ajaxCart=function(module,$){"use strict";var init,loadCart,settings,isUpdating,$body,$formContainer,$addToCart,$cartCountSelector,$cartCostSelector,$cartContainer,$drawerContainer,updateCountPrice,formOverride,itemAddedCallback,itemErrorCallback,cartUpdateCallback,buildCart,cartCallback,adjustCart,adjustCartCallback,createQtySelectors,qtySelectors,validateQty;return init=function(options){settings={formSelector:'form[action^="/cart/add"]',cartContainer:"#CartContainer",addToCartSelector:".enj-add-to-cart-btn",cartCountSelector:null,cartCostSelector:null,moneyFormat:"$",disableAjaxCart:!1,enableQtySelectors:!0},$.extend(settings,options),$formContainer=$(settings.formSelector),$cartContainer=$(settings.cartContainer),$addToCart=$formContainer.find(settings.addToCartSelector),$cartCountSelector=$(settings.cartCountSelector),$cartCostSelector=$(settings.cartCostSelector),$body=$("body"),isUpdating=!1,settings.enableQtySelectors&&qtySelectors(),!settings.disableAjaxCart&&$addToCart.length&&formOverride(),adjustCart()},loadCart=function(){$body.addClass("drawer--is-loading"),ShopifyAPI.getCart(cartUpdateCallback)},updateCountPrice=function(cart){$cartCountSelector&&($cartCountSelector.html(cart.item_count).removeClass("hidden-count"),cart.item_count===0&&$cartCountSelector.addClass("hidden-count")),$cartCostSelector&&$cartCostSelector.html(Shopify.formatMoney(cart.total_price,settings.moneyFormat))},formOverride=function(){$formContainer.on("submit",function(evt){evt.preventDefault();var $addToCart_btn=$(this).find(settings.addToCartSelector);$addToCart_btn.removeClass("is-added").addClass("is-adding"),$addToCart_btn.find("i").replaceWith('<i class="enj-loader-add-to-cart"><svg xml:space="preserve" style="enable-background:new 0 0 50 50;margin-top: -1px;" viewBox="0 0 24 30" height="20px" width="21px" y="0px" x="0px" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns="http://www.w3.org/2000/svg" id="Layer_1" version="1.1"><rect opacity="0.2" fill="#fff" height="8" width="3" y="10" x="0"><animate repeatCount="indefinite" dur="0.6s" begin="0s" values="0.2; 1; .2" attributeType="XML" attributeName="opacity"/><animate repeatCount="indefinite" dur="0.6s" begin="0s" values="10; 20; 10" attributeType="XML" attributeName="height"/><animate repeatCount="indefinite" dur="0.6s" begin="0s" values="10; 5; 10" attributeType="XML" attributeName="y"/></rect><rect opacity="0.2" fill="#fff" height="8" width="3" y="10" x="8">      <animate repeatCount="indefinite" dur="0.6s" begin="0.15s" values="0.2; 1; .2" attributeType="XML" attributeName="opacity"/><animate repeatCount="indefinite" dur="0.6s" begin="0.15s" values="10; 20; 10" attributeType="XML" attributeName="height"/><animate repeatCount="indefinite" dur="0.6s" begin="0.15s" values="10; 5; 10" attributeType="XML" attributeName="y"/></rect><rect opacity="0.2" fill="#fff" height="8" width="3" y="10" x="16"><animate repeatCount="indefinite" dur="0.6s" begin="0.3s" values="0.2; 1; .2" attributeType="XML" attributeName="opacity"/><animate repeatCount="indefinite" dur="0.6s" begin="0.3s" values="10; 20; 10" attributeType="XML" attributeName="height"/><animate repeatCount="indefinite" dur="0.6s" begin="0.3s" values="10; 5; 10" attributeType="XML" attributeName="y"/></rect></svg></i>'),$(".qty-error").remove(),ShopifyAPI.addItemFromForm(evt.target,itemAddedCallback,itemErrorCallback)})},itemAddedCallback=function(product,form){var $addToCart_btn=$(form).find(settings.addToCartSelector);$addToCart_btn.removeClass("is-adding").addClass("is-added"),$addToCart_btn.find(".enj-loader-add-to-cart").html('<i class="fa fa-check"></i>'),$(".product-popup").find(".product-name").html(product.title),$(".product-popup").find(".product-image img").attr("src",product.image),showPopup(".product-popup"),ShopifyAPI.getCart(cartUpdateCallback)},itemErrorCallback=function(XMLHttpRequest,textStatus){var data=eval("("+XMLHttpRequest.responseText+")");$addToCart.removeClass("is-adding is-added"),$addToCart.find(".enj-loader-add-to-cart").remove(),data.message&&data.status==422&&$formContainer.after('<div class="errors qty-error">'+data.description+"</div>")},cartUpdateCallback=function(cart){updateCountPrice(cart),buildCart(cart)},buildCart=function(cart){if($cartContainer.empty(),cart.item_count===0){$cartContainer.append("<p>Your cart is currently empty.</p>"),cartCallback(cart);return}var items=[],item={},data2={},source=$("#CartTemplate").html(),template=Handlebars.compile(source);$.each(cart.items,function(index,cartItem){if(cartItem.image!=null)var prodImg=cartItem.image.replace(/(\.[^.]*)$/,"_small$1").replace("http:","");else var prodImg="//cdn.shopify.com/s/assets/admin/no-image-medium-cc9732cb976dd349a0df1d39816fbcc7.gif";item={id:cartItem.variant_id,line:index+1,url:cartItem.url,img:prodImg,name:cartItem.product_title,variation:cartItem.variant_title,properties:cartItem.properties,itemAdd:cartItem.quantity+1,itemMinus:cartItem.quantity-1,itemQty:cartItem.quantity,price:Shopify.formatMoney(cartItem.price,settings.moneyFormat),vendor:cartItem.vendor},items.push(item)}),data2={items:items,note:cart.note,totalPrice:Shopify.formatMoney(cart.total_price,settings.moneyFormat)},$cartContainer.append(template(data2)),cartCallback(cart)},cartCallback=function(cart){$body.removeClass("drawer--is-loading"),$body.trigger("ajaxCart.afterCartLoad",cart)},adjustCart=function(){$body.on("click",".ajaxcart__qty-adjust",function(){var $el=$(this),line=$el.data("line"),$qtySelector=$el.siblings(".ajaxcart__qty-num"),qty=parseInt($qtySelector.val().replace(/\D/g,"")),qty=validateQty(qty);$el.hasClass("ajaxcart__qty--plus")?qty+=1:(qty-=1,qty<=0&&(qty=0)),console.log("Qty: "+qty),line?updateQuantity(line,qty):$qtySelector.val(qty)}),$body.on("submit","form.ajaxcart",function(evt){isUpdating&&evt.preventDefault()}),$body.on("focus",".ajaxcart__qty-adjust",function(){var $el=$(this);setTimeout(function(){$el.select()},50)});function updateQuantity(line,qty){isUpdating=!0;var $row=$('.ajaxcart__row[data-line="'+line+'"]').addClass("is-loading");qty===0&&$row.parent().addClass("is-removed"),setTimeout(function(){ShopifyAPI.changeItem(line,qty,adjustCartCallback)},250)}$body.on("change",'textarea[name="note"]',function(){var newNote=$(this).val();ShopifyAPI.updateCartNote(newNote,function(cart){})})},adjustCartCallback=function(cart){isUpdating=!1,updateCountPrice(cart),setTimeout(function(){ShopifyAPI.getCart(buildCart)},150)},createQtySelectors=function(){$('input[type="number"]',$cartContainer).length&&$('input[type="number"]',$cartContainer).each(function(){var $el=$(this),currentQty=$el.val(),itemAdd=currentQty+1,itemMinus=currentQty-1,itemQty=currentQty,source=$("#AjaxQty").html(),template=Handlebars.compile(source),data2={id:$el.data("id"),itemQty:itemQty,itemAdd:itemAdd,itemMinus:itemMinus};$el.after(template(data2)).remove()})},qtySelectors=function(){var numInputs=$('input[type="number"]');numInputs.length&&(numInputs.each(function(){var $el=$(this),currentQty=$el.val(),inputName=$el.attr("name"),inputId=$el.attr("id"),itemAdd=currentQty+1,itemMinus=currentQty-1,itemQty=currentQty,source=$("#JsQty").html(),template=Handlebars.compile(source),data2={id:$el.data("id"),itemQty:itemQty,itemAdd:itemAdd,itemMinus:itemMinus,inputName:inputName,inputId:inputId};$el.after(template(data2)).remove()}),$(".js-qty__adjust").on("click",function(){var $el=$(this),id=$el.data("id"),$qtySelector=$el.siblings(".js-qty__num"),qty=parseInt($qtySelector.val().replace(/\D/g,"")),qty=validateQty(qty);$el.hasClass("js-qty__adjust--plus")?(qty+=1,console.log(qty),updatePricingQty(qty)):(qty-=1,qty<=1&&(qty=1),updatePricingQty(qty)),$qtySelector.val(qty)}))},validateQty=function(qty){return parseFloat(qty)==parseInt(qty)&&!isNaN(qty)||(qty=1),qty},module={init:init,load:loadCart},module}(ajaxCart||{},jQuery);
//# sourceMappingURL=/cdn/shop/t/2/assets/ajax-cart.js.map?v=179199444507144208451577421659
