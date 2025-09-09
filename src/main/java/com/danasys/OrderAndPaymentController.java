package com.danasys;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.danasys.dto.OrdarStatusEnum;
import com.danasys.dto.OrderDetailsDTO;
import com.danasys.dto.OrderStatusUpdateRequest;
import com.danasys.dto.PurchasedProductDTO;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@Tag(name = "Order And Payment Management", description = "APIs for order and payment management")
public class OrderAndPaymentController {


	@GetMapping("/api/order/orderTracker/{orderId}")
	public ResponseEntity<OrderDetailsDTO> orderTracker(@PathVariable Long orderId) {
		OrderDetailsDTO order = new OrderDetailsDTO();
		order.setId(1l);
		order.setDeliveryAddress("Dummy Address");
		order.setOrderDeliverTimeSlot(new Date());
		order.setOrderStatus(OrdarStatusEnum.ORDER_PLACED);
		order.setTotalDiscount(20.20d);
		order.setTotalPrice(100.12d);
		
		PurchasedProductDTO product=new PurchasedProductDTO();
		product.setMRP(200d);
		product.setOfferPrice(120d);
		product.setQuantity(2);
		product.setStatus(OrdarStatusEnum.ORDER_PLACED);
		product.setReturnDateLimit(new Date());
		product.setPurchasedProductId(1l);
		
		PurchasedProductDTO product1=new PurchasedProductDTO();
		product1.setMRP(400d);
		product1.setOfferPrice(220d);
		product1.setQuantity(4);
		product1.setStatus(OrdarStatusEnum.ORDER_PLACED);
		product1.setReturnDateLimit(new Date());
		product1.setPurchasedProductId(2l);
		
		
		List<PurchasedProductDTO> productList = new ArrayList<>();
		productList.add(product);
		productList.add(product1);
		order.setProducts(productList);
		
		
		return ResponseEntity.ok(order);
	}
	
	
	@GetMapping("/api/order/orderHistory/{userProfileId}")
	public ResponseEntity<List<OrderDetailsDTO>> orderHistory(@PathVariable Long userProfileId) {
		List<OrderDetailsDTO> orderList = new ArrayList<>();
		
		OrderDetailsDTO order = new OrderDetailsDTO();
		order.setId(1l);
		order.setDeliveryAddress("Dummy Address");
		order.setOrderDeliverTimeSlot(new Date());
		order.setOrderStatus(OrdarStatusEnum.ORDER_PLACED);
		order.setTotalDiscount(20.20d);
		order.setTotalPrice(100.12d);
		
		OrderDetailsDTO order1 = new OrderDetailsDTO();
		order1.setId(2l);
		order1.setDeliveryAddress("Dummy Address");
		order1.setOrderDeliverTimeSlot(new Date());
		order1.setOrderStatus(OrdarStatusEnum.ORDER_PLACED);
		order1.setTotalDiscount(20.20d);
		order1.setTotalPrice(100.12d);
		
		PurchasedProductDTO product=new PurchasedProductDTO();
		product.setMRP(200d);
		product.setOfferPrice(120d);
		product.setQuantity(2);
		product.setStatus(OrdarStatusEnum.ORDER_PLACED);
		product.setReturnDateLimit(new Date());
		product.setPurchasedProductId(1l);
		
		PurchasedProductDTO product1=new PurchasedProductDTO();
		product1.setMRP(400d);
		product1.setOfferPrice(220d);
		product1.setQuantity(4);
		product1.setStatus(OrdarStatusEnum.ORDER_PLACED);
		product1.setReturnDateLimit(new Date());
		product1.setPurchasedProductId(2l);
		
		
		List<PurchasedProductDTO> productList = new ArrayList<>();
		productList.add(product);
		productList.add(product1);
		
		order.setProducts(productList);
		order1.setProducts(productList);
		
		
		orderList.add(order);
		orderList.add(order1);
		
		
		return ResponseEntity.ok(orderList);
	}
	
	@PostMapping("/api/order/updateOrderStatusByBU")
	public ResponseEntity<String> updateOrderStatus(@RequestBody OrderStatusUpdateRequest orderStatusUpdateRequest) {
		
		return ResponseEntity.ok("Status update sucessfully ");
	}
	
	@PostMapping("/api/order/acceptReturn")
	public ResponseEntity<String> acceptReturn(@RequestBody OrderStatusUpdateRequest orderStatusUpdateRequest) {
		return ResponseEntity.ok("Status update sucessfully ");
	}
	
	@PostMapping("/api/order/returnOrder")
	public ResponseEntity<String> returnOrder(@RequestBody OrderStatusUpdateRequest returnOrderRequest) {
	
		return ResponseEntity.ok("return sucessfully ");
	}
	
	@GetMapping("/api/order/fetchActiveOrder/{userProfileId}")
	public ResponseEntity<List<OrderDetailsDTO>> fetchActiveOrder(@PathVariable Long userProfileId) {
		List<OrderDetailsDTO> orderList =new ArrayList<>();
		

		
		OrderDetailsDTO order = new OrderDetailsDTO();
		order.setId(1l);
		order.setDeliveryAddress("Dummy Address");
		order.setOrderDeliverTimeSlot(new Date());
		order.setOrderStatus(OrdarStatusEnum.ORDER_PLACED);
		order.setTotalDiscount(20.20d);
		order.setTotalPrice(100.12d);
		
		OrderDetailsDTO order1 = new OrderDetailsDTO();
		order1.setId(2l);
		order1.setDeliveryAddress("Dummy Address");
		order1.setOrderDeliverTimeSlot(new Date());
		order1.setOrderStatus(OrdarStatusEnum.ORDER_PLACED);
		order1.setTotalDiscount(20.20d);
		order1.setTotalPrice(100.12d);
		
		PurchasedProductDTO product=new PurchasedProductDTO();
		product.setMRP(200d);
		product.setOfferPrice(120d);
		product.setQuantity(2);
		product.setStatus(OrdarStatusEnum.ORDER_PLACED);
		product.setReturnDateLimit(new Date());
		product.setPurchasedProductId(1l);
		
		PurchasedProductDTO product1=new PurchasedProductDTO();
		product1.setMRP(400d);
		product1.setOfferPrice(220d);
		product1.setQuantity(4);
		product1.setStatus(OrdarStatusEnum.ORDER_PLACED);
		product1.setReturnDateLimit(new Date());
		product1.setPurchasedProductId(2l);
		
		
		List<PurchasedProductDTO> productList = new ArrayList<>();
		productList.add(product);
		productList.add(product1);
		
		order.setProducts(productList);
		order1.setProducts(productList);
		
		
		orderList.add(order);
		orderList.add(order1);
		
		return ResponseEntity.ok(orderList);
	}

	
		@GetMapping("/api/payment/getWalletBalance/{userProfileId}")
		@Operation(summary = "User wallet balance", description = "User wallet balance")
		public ResponseEntity<Double> getWalletBalance(@PathVariable Long userProfileId) {
	    	
	    	return ResponseEntity.ok(100.00d);
	    }
	    
	   	@GetMapping("/api/payment/getUnclearedWalletBalance/{userProfileId}")
	   	@Operation(summary = "User wallet uncleared balance", description = "\"User wallet uncleared balance")
	   	public ResponseEntity<Double> getUnclearedWalletBalance(@PathVariable Long userProfileId) {
	       	return ResponseEntity.ok(500d);
	       }
	    
	   	@GetMapping("/api/payment/getUnclearedReferalPoint/{userProfileId}")
	   	@Operation(summary = "User wallet uncleared referal point", description = "\"User wallet uncleared referal point")
	   	public ResponseEntity<Double> getUnclearedReferalPoint(@PathVariable Long userProfileId) {
	       	return ResponseEntity.ok(400d);
	       }
	    
	   	@GetMapping("/api/payment/getClearedReferalPoint/{userProfileId}")
	   	@Operation(summary = "User wallet cleared referal point", description = "\"User wallet cleared referal point")
	   	public ResponseEntity<Double> getClearedReferalPoint(@PathVariable Long userProfileId) {
	       	return ResponseEntity.ok(320d);
	       }
	
}
