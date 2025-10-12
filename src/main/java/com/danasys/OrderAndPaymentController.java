package com.danasys;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.http.ResponseEntity;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.danasys.dto.BankTransferRequestDTO;
import com.danasys.dto.OrdarStatusEnum;
import com.danasys.dto.OrderDetailsDTO;
import com.danasys.dto.OrderStatusUpdateRequest;
import com.danasys.dto.OrderSummaryDTO;
import com.danasys.dto.OrderTrackerDTO;
import com.danasys.dto.PlaceOrderRequest;
import com.danasys.dto.PurchasedProductDTO;
import com.danasys.dto.TransactionDTO;
import com.danasys.dto.TransactionTypeEnum;
import com.danasys.dto.TransferMoneyDTO;
import com.danasys.dto.UserAccountTransactionDTO;
import com.danasys.user.enums.AccountTransferStatusEnum;
import com.danasys.user.enums.TransferRequestTypeEnum;
import com.danasys.user.enums.UserRoleEnum;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonMappingException;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@Tag(name = "Order And Payment Management", description = "APIs for order and payment management")
public class OrderAndPaymentController {

	@GetMapping("/api/order/orderTracker/{orderId}")
	public ResponseEntity<OrderDetailsDTO> orderTracker(@PathVariable Long orderId) {
		
		if(orderId>0) {
		OrderDetailsDTO order = new OrderDetailsDTO();
		order.setId(1l);
		order.setDeliveryAddress("Dummy Address");
		order.setOrderDeliverTimeSlot(new Date());
		order.setOrderStatus(OrdarStatusEnum.ORDER_PLACED);
		order.setTotalDiscount(20.20d);
		order.setTotalPrice(100.12d);

		PurchasedProductDTO product = new PurchasedProductDTO();
		product.setMRP(200d);
		product.setOfferPrice(120d);
		product.setQuantity(2);
		product.setStatus(OrdarStatusEnum.ORDER_PLACED);
		product.setReturnDateLimit(new Date());
		product.setPurchasedProductId(1l);

		PurchasedProductDTO product1 = new PurchasedProductDTO();
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

		OrderTrackerDTO trackerP = new OrderTrackerDTO();
		;

		OrderTrackerDTO trackerC = new OrderTrackerDTO();
		trackerC.setRole(UserRoleEnum.ROLE_USER);
		trackerC.setActionOn(new Date());
		trackerC.setActor("USER 1");
		trackerC.setAction(OrdarStatusEnum.IN_PROGRESS.name());
		trackerP.getTracker().add(trackerC);

		OrderTrackerDTO trackerC1 = new OrderTrackerDTO();
		trackerC1.setRole(UserRoleEnum.ROLE_USER);
		trackerC1.setActionOn(new Date());
		trackerC1.setActor("USER 1");
		trackerC1.setAction(OrdarStatusEnum.ORDER_PLACED.name());
		trackerP.getTracker().add(trackerC1);

		OrderTrackerDTO trackerC2 = new OrderTrackerDTO();
		trackerC2.setRole(UserRoleEnum.ROLE_BUSINESS_USER);
		trackerC2.setActionOn(new Date());
		trackerC2.setActor("Gupta Ji");
		trackerC2.setAction(OrdarStatusEnum.DELIVERED.name());
		trackerP.getTracker().add(trackerC2);

		order.setOrderTracker(trackerP);
		return ResponseEntity.ok(order);
		}
		return null;
	}

	@GetMapping("/api/order/orderHistory/{userProfileId}")
	public ResponseEntity<List<OrderDetailsDTO>> orderHistory(@PathVariable Long userProfileId) {
		
		if(userProfileId>0) {
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

		PurchasedProductDTO product = new PurchasedProductDTO();
		product.setMRP(200d);
		product.setOfferPrice(120d);
		product.setQuantity(2);
		product.setStatus(OrdarStatusEnum.ORDER_PLACED);
		product.setReturnDateLimit(new Date());
		product.setPurchasedProductId(1l);

		PurchasedProductDTO product1 = new PurchasedProductDTO();
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

		OrderTrackerDTO trackerP = new OrderTrackerDTO();
		;

		OrderTrackerDTO trackerC = new OrderTrackerDTO();
		trackerC.setRole(UserRoleEnum.ROLE_USER);
		trackerC.setActionOn(new Date());
		trackerC.setActor("USER 1");
		trackerC.setAction(OrdarStatusEnum.IN_PROGRESS.name());
		trackerP.getTracker().add(trackerC);

		OrderTrackerDTO trackerC1 = new OrderTrackerDTO();
		trackerC1.setRole(UserRoleEnum.ROLE_USER);
		trackerC1.setActionOn(new Date());
		trackerC1.setActor("USER 1");
		trackerC1.setAction(OrdarStatusEnum.ORDER_PLACED.name());
		trackerP.getTracker().add(trackerC1);

		OrderTrackerDTO trackerC2 = new OrderTrackerDTO();
		trackerC2.setRole(UserRoleEnum.ROLE_BUSINESS_USER);
		trackerC2.setActionOn(new Date());
		trackerC2.setActor("Gupta Ji");
		trackerC2.setAction(OrdarStatusEnum.DELIVERED.name());
		trackerP.getTracker().add(trackerC2);

		order.setOrderTracker(trackerP);
		order1.setOrderTracker(trackerP);

		orderList.add(order);
		orderList.add(order1);

		return ResponseEntity.ok(orderList);
		}
		
		return ResponseEntity.badRequest().body(null);
	}
	
	@GetMapping("/api/order/myOrderHistory/{userProfileId}")
	public ResponseEntity<List<OrderDetailsDTO>> myOrderHistory(@PathVariable Long userProfileId) {
		
		if(userProfileId>0) {
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

		PurchasedProductDTO product = new PurchasedProductDTO();
		product.setMRP(200d);
		product.setOfferPrice(120d);
		product.setQuantity(2);
		product.setStatus(OrdarStatusEnum.ORDER_PLACED);
		product.setReturnDateLimit(new Date());
		product.setPurchasedProductId(1l);

		PurchasedProductDTO product1 = new PurchasedProductDTO();
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

		OrderTrackerDTO trackerP = new OrderTrackerDTO();
		;

		OrderTrackerDTO trackerC = new OrderTrackerDTO();
		trackerC.setRole(UserRoleEnum.ROLE_USER);
		trackerC.setActionOn(new Date());
		trackerC.setActor("USER 1");
		trackerC.setAction(OrdarStatusEnum.IN_PROGRESS.name());
		trackerP.getTracker().add(trackerC);

		OrderTrackerDTO trackerC1 = new OrderTrackerDTO();
		trackerC1.setRole(UserRoleEnum.ROLE_USER);
		trackerC1.setActionOn(new Date());
		trackerC1.setActor("USER 1");
		trackerC1.setAction(OrdarStatusEnum.ORDER_PLACED.name());
		trackerP.getTracker().add(trackerC1);

		OrderTrackerDTO trackerC2 = new OrderTrackerDTO();
		trackerC2.setRole(UserRoleEnum.ROLE_BUSINESS_USER);
		trackerC2.setActionOn(new Date());
		trackerC2.setActor("Gupta Ji");
		trackerC2.setAction(OrdarStatusEnum.DELIVERED.name());
		trackerP.getTracker().add(trackerC2);

		order.setOrderTracker(trackerP);
		order1.setOrderTracker(trackerP);

		orderList.add(order);
		orderList.add(order1);

		return ResponseEntity.ok(orderList);
		}
		
		return ResponseEntity.badRequest().body(null);
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
	public ResponseEntity<String> returnOrder(@RequestBody OrderStatusUpdateRequest returnOrderRequest,
			@RequestPart("file") MultipartFile file) {

		return ResponseEntity.ok("return sucessfully ");
	}

	@GetMapping("/api/order/fetchActiveOrder/{userProfileId}")
	public ResponseEntity<List<OrderDetailsDTO>> fetchActiveOrder(@PathVariable Long userProfileId) {
		
		if(userProfileId>0) {
			
		
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

		PurchasedProductDTO product = new PurchasedProductDTO();
		product.setMRP(200d);
		product.setOfferPrice(120d);
		product.setQuantity(2);
		product.setStatus(OrdarStatusEnum.ORDER_PLACED);
		product.setReturnDateLimit(new Date());
		product.setPurchasedProductId(1l);

		PurchasedProductDTO product1 = new PurchasedProductDTO();
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
		return ResponseEntity.badRequest().body(null);
	}
	
	
	

	@GetMapping("/api/payment/getWalletBalance/{userProfileId}")
	@Operation(summary = "User wallet balance", description = "User wallet balance")
	public ResponseEntity<UserAccountTransactionDTO> getWalletBalance(@PathVariable Long userProfileId) {
		
		if(userProfileId>0) {
		UserAccountTransactionDTO dto = new UserAccountTransactionDTO();
		dto.setCurrentBalance(501d);

		List<BankTransferRequestDTO> transactionList = new ArrayList();
		BankTransferRequestDTO t1 = new BankTransferRequestDTO();
		t1.setAmount("-" + 550d);
		t1.setBankName("HDFC Bank Madhuban delhi");
		t1.setReqDate(new Date());
		t1.setReqRaisedBy("Gupta Ji");
		t1.setRequestType(TransferRequestTypeEnum.WALLET_TO_BANK_DONE);
		t1.setStatus(AccountTransferStatusEnum.TRANSFER_DONE);
		t1.setToUser("Gupta ji bank account");

		BankTransferRequestDTO t2 = new BankTransferRequestDTO();
		t2.setAmount("-" + 500d);
		t2.setBankName("Axis Bank Noida");
		t2.setReqDate(new Date());
		t2.setReqRaisedBy("Admin");
		t2.setRequestType(TransferRequestTypeEnum.WALLET_TO_BANK_DONE);
		t2.setStatus(AccountTransferStatusEnum.TRANSFER_DONE);
		t2.setToUser("Gupta ji bank account");

		BankTransferRequestDTO t3 = new BankTransferRequestDTO();
		t3.setAmount("-" + 800d);
		t3.setBankName("SBI Bank Gzb");
		t3.setReqDate(new Date());
		t3.setReqRaisedBy("Gupta Ji");
		t3.setRequestType(TransferRequestTypeEnum.WALLET_TO_BANK_REQ);
		t3.setStatus(AccountTransferStatusEnum.TRANSFER_REQ_RAISED);
		t3.setToUser("Gupta ji bank account");

		BankTransferRequestDTO t4 = new BankTransferRequestDTO();
		t4.setAmount("+" + 800d);
		t4.setBankName("SBI Bank Gzb");
		t4.setReqDate(new Date());
		t4.setReqRaisedBy("Gupta Ji");
		t4.setRequestType(TransferRequestTypeEnum.WALLET_TO_BANK_REQ);
		t4.setStatus(AccountTransferStatusEnum.TRANSFER_DECLIENED);
		t4.setToUser("Gupta ji bank account");

		BankTransferRequestDTO t5 = new BankTransferRequestDTO();
		t5.setAmount("+" + 800d);
		t5.setBankName("SBI Bank Gzb");
		t5.setReqDate(new Date());
		t5.setReqRaisedBy("Gupta Ji");
		t5.setRequestType(TransferRequestTypeEnum.UNCLEARED_TO_WALLET_DONE);
		t5.setStatus(AccountTransferStatusEnum.TRANSFER_DONE);
		t5.setToUser("Gupta ji bank account");

		transactionList.add(t4);
		transactionList.add(t4);
		transactionList.add(t2);
		transactionList.add(t1);
		transactionList.add(t3);
		transactionList.add(t2);
		transactionList.add(t1);
		transactionList.add(t3);
		transactionList.add(t2);
		transactionList.add(t1);
		transactionList.add(t3);
		transactionList.add(t2);
		transactionList.add(t1);
		dto.setTransferReqDTO(transactionList);
		return ResponseEntity.ok(dto);
		}
		return null;
	}

	@GetMapping("/api/payment/getUnclearedWalletBalance/{userProfileId}")
	@Operation(summary = "User wallet uncleared balance", description = "\"User wallet uncleared balance")
	public ResponseEntity<UserAccountTransactionDTO> getUnclearedWalletBalance(@PathVariable Long userProfileId) {

		if(userProfileId>0) {
		UserAccountTransactionDTO dto = new UserAccountTransactionDTO();
		dto.setCurrentBalance(790d);

		List<TransactionDTO> transactionList = new ArrayList();
		TransactionDTO t1 = new TransactionDTO();
		t1.setAmount("+" + 50d);
		t1.setOrderId(130l);
		t1.setTransactionDatel(new Date());
		t1.setType(TransactionTypeEnum.BU_UNCLEARED_PAYMENT_CREDIT);

		TransactionDTO t2 = new TransactionDTO();
		t2.setAmount("-" + 50d);
		t2.setOrderId(130l);
		t2.setTransactionDatel(new Date());
		t2.setType(TransactionTypeEnum.BU_UNCLEARED_REFUND_DEBIT);

		TransactionDTO t3 = new TransactionDTO();
		t3.setAmount("-" + 50d);
		t3.setOrderId(130l);
		t3.setTransactionDatel(new Date());
		t3.setType(TransactionTypeEnum.BU_CLEARED_PAYMENT_TXN);

		transactionList.add(t3);
		transactionList.add(t2);
		transactionList.add(t1);
		dto.setTransactionDTO(transactionList);
		return ResponseEntity.ok(dto);
		}
		return null;
	}

	@GetMapping("/api/payment/getUnclearedReferalPoint/{userProfileId}")
	@Operation(summary = "User wallet uncleared referal point", description = "\"User wallet uncleared referal point")
	public ResponseEntity<UserAccountTransactionDTO> getUnclearedReferalPoint(@PathVariable Long userProfileId) {

		if(userProfileId>0) {
		UserAccountTransactionDTO dto = new UserAccountTransactionDTO();
		dto.setCurrentBalance(490d);

		List<TransactionDTO> transactionList = new ArrayList();
		TransactionDTO t1 = new TransactionDTO();
		t1.setAmount("+" + 50d);
		t1.setOrderId(130l);
		t1.setTransactionDatel(new Date());
		t1.setType(TransactionTypeEnum.REFFERAL_UNCLEARED_POINT_CREDIT);

		TransactionDTO t2 = new TransactionDTO();
		t2.setAmount("-" + 50d);
		t2.setOrderId(130l);
		t2.setTransactionDatel(new Date());
		t2.setType(TransactionTypeEnum.REFERRAL_UNCLEARED_POINT_REVOKE_DEBIT);

		TransactionDTO t3 = new TransactionDTO();
		t3.setAmount("+" + 50d);
		t3.setOrderId(230l);
		t3.setTransactionDatel(new Date());
		t3.setType(TransactionTypeEnum.REFERRAL_UNCLEARED_TO_CLEARED_TXN);

		transactionList.add(t3);
		transactionList.add(t2);
		transactionList.add(t1);
		dto.setTransactionDTO(transactionList);
		return ResponseEntity.ok(dto);
		}
		return null;
	}

	@GetMapping("/api/payment/getClearedReferalPoint/{userProfileId}")
	@Operation(summary = "User wallet cleared referal point", description = "\"User wallet cleared referal point")
	public ResponseEntity<UserAccountTransactionDTO> getClearedReferalPoint(@PathVariable Long userProfileId) {
		
		if(userProfileId>0) {
		UserAccountTransactionDTO dto = new UserAccountTransactionDTO();
		dto.setCurrentBalance(490d);

		List<TransactionDTO> transactionList = new ArrayList();
		TransactionDTO t1 = new TransactionDTO();
		t1.setAmount("+" + 50d);
		t1.setOrderId(130l);
		t1.setTransactionDatel(new Date());
		t1.setType(TransactionTypeEnum.REFERRAL_UNCLEARED_TO_CLEARED_TXN);

		TransactionDTO t2 = new TransactionDTO();
		t2.setAmount("-" + 50d);
		t2.setOrderId(130l);
		t2.setTransactionDatel(new Date());
		t2.setType(TransactionTypeEnum.REFFERAL_REDEEMED_CLEARED_POINT_TXN);

		transactionList.add(t2);
		transactionList.add(t1);
		dto.setTransactionDTO(transactionList);
		return ResponseEntity.ok(dto);
		}
		return null;
	}

	
	

	
	@GetMapping("/api/payment/getAllPendingTransferRequest")
	public ResponseEntity<UserAccountTransactionDTO> getAllPendingTransferRequest() {

		UserAccountTransactionDTO dto = new UserAccountTransactionDTO();
		dto.setCurrentBalance(50000d);
		List<AccountTransferStatusEnum> status = new ArrayList<>();
		status.add(AccountTransferStatusEnum.TRANSFER_DECLIENED);
		status.add(AccountTransferStatusEnum.TRANSFER_DONE);
		status.add(AccountTransferStatusEnum.TRANSFER_REQ_RAISED);
		

		List<BankTransferRequestDTO> allPendingReq = new ArrayList<>();

		BankTransferRequestDTO t1 = new BankTransferRequestDTO();
		t1.setAmount("-" + 550d);
		t1.setBankName("HDFC Bank Madhuban delhi");
		t1.setReqDate(new Date());
		t1.setReqRaisedBy("Gupta Ji");
		t1.setRequestType(TransferRequestTypeEnum.WALLET_TO_BANK_REQ);
		t1.setStatus(AccountTransferStatusEnum.TRANSFER_REQ_RAISED);
		t1.setToUser("Gupta ji bank account");

		BankTransferRequestDTO t2 = new BankTransferRequestDTO();
		t2.setAmount("-" + 550d);
		t2.setBankName("HDFC Bank Madhuban delhi");
		t2.setReqDate(new Date());
		t2.setReqRaisedBy("Gupta Ji");
		t2.setRequestType(TransferRequestTypeEnum.WALLET_TO_BANK_REQ);
		t2.setStatus(AccountTransferStatusEnum.TRANSFER_REQ_RAISED);
		t2.setToUser("Gupta ji bank account");

		allPendingReq.add(t1);
		allPendingReq.add(t2);
		dto.setTransferReqDTO(allPendingReq);

		return ResponseEntity.ok(dto);
	}
	
	@GetMapping("/api/payment/getTransferRequestHistory/{userProfileId}")
	public ResponseEntity<List<BankTransferRequestDTO>> getTransferRequestHistory(@PathVariable Long userProfileId) {

		//if(userProfileId>0) 
		{
		List<BankTransferRequestDTO> allPendingReq = new ArrayList<>();

		BankTransferRequestDTO t1 = new BankTransferRequestDTO();
		t1.setAmount("-" + 550d);
		t1.setBankName("HDFC Bank Madhuban delhi");
		t1.setReqDate(new Date());
		t1.setReqRaisedBy("Gupta Ji");
		t1.setRequestType(TransferRequestTypeEnum.WALLET_TO_BANK_REQ);
		t1.setStatus(AccountTransferStatusEnum.TRANSFER_REQ_RAISED);
		t1.setToUser("Gupta ji bank account");

		BankTransferRequestDTO t2 = new BankTransferRequestDTO();
		t2.setAmount("-" + 550d);
		t2.setBankName("HDFC Bank Madhuban delhi");
		t2.setReqDate(new Date());
		t2.setReqRaisedBy("Gupta Ji");
		t2.setRequestType(TransferRequestTypeEnum.WALLET_TO_BANK_REQ);
		t2.setStatus(AccountTransferStatusEnum.TRANSFER_REQ_RAISED);
		t2.setToUser("Gupta ji bank account");

		allPendingReq.add(t1);
		allPendingReq.add(t2);
		

		return ResponseEntity.ok(allPendingReq);
		}
		
	}
	
	@PostMapping("/api/order/transferPlatformToBankAccount")
	public ResponseEntity<String> transferPlatformToBankAccount(@RequestBody TransferMoneyDTO transferMoneyDTO) {

		return ResponseEntity.ok("Point Redeemed ! ");

	}

	@PostMapping("/api/order/transferWalletToBankAccount")
	public ResponseEntity<String> transferWalletToBankAccount(@RequestBody TransferMoneyDTO transferMoneyDTO) {

		return ResponseEntity.ok("Point Redeemed ! ");

	}

	@PostMapping("/api/order/transferWalletToBankAccountRequest")
	public ResponseEntity<String> transferWalletToBankAccountRequest(@RequestBody TransferMoneyDTO transferMoneyDTO) {

		return ResponseEntity.ok("Point Redeemed ! ");

	}

	@PostMapping("/api/order/redeemReferalPoint")
	public ResponseEntity<String> redeemReferalPoint(Long userProfileId) {
		return ResponseEntity.ok("Point Redeemed ! ");

	}
	
	@PostMapping("/api/order/holdOrder")
	@Operation(summary = "Place order", description = "API to place order")
	public ResponseEntity<OrderSummaryDTO> holdOrder(@RequestBody PlaceOrderRequest placeOrderRequest) {
		OrderSummaryDTO summary = new OrderSummaryDTO();
		summary.setDateOfDelivery(new Date());
		summary.setOrderId(1l);
		summary.setTotalDiscount(20d);
		summary.setTotalPrice(200d);
		
		return ResponseEntity.ok(summary);
	}
	
	@PostMapping("/api/order/placeOrder")
	@Operation(summary = "Place order", description = "API to place order")
	public ResponseEntity<OrderSummaryDTO> placeOrder(@RequestBody PlaceOrderRequest placeOrderRequest) {
		OrderSummaryDTO summary = new OrderSummaryDTO();
		summary.setDateOfDelivery(new Date());
		summary.setOrderId(1l);
		summary.setTotalDiscount(20d);
		summary.setTotalPrice(200d);
		return ResponseEntity.ok(summary);
	}

}
