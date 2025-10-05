package com.danasys;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import com.danasys.dto.Invoice;
import com.danasys.dto.InvoiceItem;

import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.common.PDRectangle;
import org.apache.pdfbox.pdmodel.font.PDType1Font;
import org.apache.pdfbox.pdmodel.PDPageContentStream;

@RestController
@RequestMapping("/api/order/invoice")
public class InvoiceController {

	@GetMapping("/{orderId}/download")
	public ResponseEntity<ByteArrayResource> downloadInvoice(@PathVariable Long orderId,
			@RequestParam(defaultValue = "pdf") String type) throws IOException {

		Invoice invoice = findInvoiceById(orderId);
		if (invoice == null)
			return ResponseEntity.notFound().build();

		if ("pdf".equalsIgnoreCase(type)) {
			byte[] pdf = generateInvoicePdf(invoice);
			ByteArrayResource resource = new ByteArrayResource(pdf);

			HttpHeaders headers = new HttpHeaders();
			headers.setContentType(MediaType.APPLICATION_PDF);
			headers.setContentDisposition(ContentDisposition.attachment().filename("invoice-" + orderId + ".pdf").build());
			headers.setContentLength(pdf.length);
			// optional caching headers, security headers, etc.

			return ResponseEntity.ok().headers(headers).body(resource);
		} else if ("text".equalsIgnoreCase(type)) {
			String txt = generateInvoiceText(invoice);
			byte[] bytes = txt.getBytes(StandardCharsets.UTF_8);
			ByteArrayResource resource = new ByteArrayResource(bytes);
			HttpHeaders headers = new HttpHeaders();
			headers.setContentType(MediaType.TEXT_PLAIN);
			headers.setContentDisposition(ContentDisposition.attachment().filename("invoice-" + orderId + ".txt").build());
			return ResponseEntity.ok().headers(headers).contentLength(bytes.length).body(resource);
		} else if ("html".equalsIgnoreCase(type)) {
			// Return HTML string or render a Thymeleaf template; set Content-Type text/html
			// and return inline
			String html = "<html>...</html>"; // produce from template
			byte[] bytes = html.getBytes(StandardCharsets.UTF_8);
			HttpHeaders headers = new HttpHeaders();
			headers.setContentType(MediaType.TEXT_HTML);
			headers.setContentDisposition(ContentDisposition.inline().filename("invoice-" + orderId + ".html").build());
			return ResponseEntity.ok().headers(headers).contentLength(bytes.length).body(new ByteArrayResource(bytes));
		} else {
			return ResponseEntity.badRequest().build();
		}
	}
	

	 // Example finder - replace with DB call
	 public Invoice findInvoiceById(Long id) {
	     // stub sample invoice
	     var items = List.of(
	         new InvoiceItem("Product A", 2, new BigDecimal("19.99")),
	         new InvoiceItem("Service B", 1, new BigDecimal("99.50"))
	     );
	     return new Invoice(id, LocalDate.now(), "ACME Corp", items);
	 }

	 public byte[] generateInvoicePdf(Invoice invoice) throws IOException {
	     try (PDDocument doc = new PDDocument();
	          ByteArrayOutputStream baos = new ByteArrayOutputStream()) {

	         PDPage page = new PDPage(PDRectangle.LETTER);
	         doc.addPage(page);

	         try (PDPageContentStream cs = new PDPageContentStream(doc, page)) {
	             cs.beginText();
	             cs.setFont(PDType1Font.HELVETICA_BOLD, 18);
	             cs.newLineAtOffset(50, 740);
	             cs.showText("Invoice #" + invoice.getId());
	             cs.newLineAtOffset(0, -25);

	             cs.setFont(PDType1Font.HELVETICA, 12);
	             cs.setLeading(14.5f);
	             cs.newLine();
	             cs.showText("Date: " + invoice.getDate().format(DateTimeFormatter.ISO_DATE));
	             cs.newLine();
	             cs.showText("Customer: " + invoice.getCustomerName());
	             cs.newLine();
	             cs.newLine();
	             cs.showText("Items:");
	             cs.newLine();

	             for (InvoiceItem it : invoice.getItems()) {
	                 String line = String.format("%s  | Qty: %d  | Unit: %s  | Total: %s",
	                         it.getDescription(), it.getQuantity(), it.getUnitPrice().toPlainString(), it.getTotal().toPlainString());
	                 cs.showText(line);
	                 cs.newLine();
	             }
	             cs.newLine();
	             cs.showText("Grand Total: " + invoice.getGrandTotal().toPlainString());
	             cs.endText();
	         }

	         doc.save(baos);
	         return baos.toByteArray();
	     }
	 }

	 // optional: text format
	 public String generateInvoiceText(Invoice invoice) {
	     StringBuilder sb = new StringBuilder();
	     sb.append("Invoice #: ").append(invoice.getId()).append("\n");
	     sb.append("Date: ").append(invoice.getDate()).append("\n");
	     sb.append("Customer: ").append(invoice.getCustomerName()).append("\n\n");
	     sb.append("Items:\n");
	     invoice.getItems().forEach(it ->
	         sb.append(String.format("%s | %d x %s = %s\n",
	                 it.getDescription(), it.getQuantity(), it.getUnitPrice(), it.getTotal()))
	     );
	     sb.append("\nGrand total: ").append(invoice.getGrandTotal()).append("\n");
	     return sb.toString();
	 }
}
