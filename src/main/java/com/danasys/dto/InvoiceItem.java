package com.danasys.dto;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;

import lombok.Getter;
import lombok.Setter;


@Setter
@Getter
public class InvoiceItem {
    private String description;
    private int quantity;
    private BigDecimal unitPrice;

    public InvoiceItem(String description, int quantity, BigDecimal unitPrice) {
        this.description = description;
        this.quantity = quantity;
        this.unitPrice = unitPrice;
    }
    // getters...
    public BigDecimal getTotal() {
        return unitPrice.multiply(new BigDecimal(quantity));
    }
}