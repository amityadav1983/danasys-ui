package com.danasys.dto;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class DasboardDetailsDTO  implements Serializable {

	private static final long serialVersionUID = 1L;
	private int planYear;
	private int totalSaleInThisYear;
	private int totalCustomerThisYear;
	private List<String> totalBusinessProfile;
		
	// bar
	private int totalNewOrder; // needs to deliver
	private int validReturnOrder; // applicable for return 
	private int orderInDispute;
	
	//payment
	private int moneyInWallet;
	private int unclearedMoney;
	private int clearedReferalAmount;
	
	
	//Stock
	private Map<String,Integer> lowStock; // Grocery(AATA) - 5  
	private Map<String,Integer> topFiveCustomers; // //Raj Kumar(9711561111) - 15k
	private List<OrderFlow> orderFlow = new ArrayList<>(); // 01-jan-2025 - 5 order
	
}

class OrderFlow {
	
	private Date day;
	private int orders;
}
