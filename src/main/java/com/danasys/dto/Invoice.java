package com.danasys.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Date;
import java.util.List;

import lombok.Getter;
import lombok.Setter;


@Setter
@Getter
public class Invoice {
    private Long id;
    private LocalDate date;
    private String customerName;
    private List<InvoiceItem> items;

    public Invoice(Long id, LocalDate date, String customerName, List<InvoiceItem> items) {
        this.id = id; this.date = date; this.customerName = customerName; this.items = items;
    }
    // getters...
    public BigDecimal getGrandTotal() {
        return items.stream()
                    .map(InvoiceItem::getTotal)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);
    }
}