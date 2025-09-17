package com.danasys;

import static org.springframework.http.MediaType.MULTIPART_FORM_DATA_VALUE;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.danasys.dto.ProductCategoryEnum;
import com.danasys.dto.ProductDTO;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@Tag(name = "Product Management", description = "APIs for product management")
public class ProductController {

	@Value("${file.upload-dir}")
	private String uploadDir;

	@Value("${file.access-url}")
	private String accessUrl;

	@GetMapping("/api/product/userBusinessProductList/{userBusinessProfileId}")
	public List<ProductDTO> vanderProductList(@PathVariable Long userBusinessProfileId) throws IOException {
		List<ProductDTO> products = new ArrayList();
		Long id = 100000l;
		populateDefaultProduct(userBusinessProfileId, products, id, ProductCategoryEnum.Grocery.name());
		return products;

	}

	@PostMapping(value = "/api/product/addProduct", consumes = MULTIPART_FORM_DATA_VALUE)
	public ResponseEntity<String> addProduct(@ModelAttribute("product") ProductDTO productDTO,
			@RequestPart("file") MultipartFile file) throws IOException {

		return ResponseEntity.ok().body(" successful");
	}

	@PostMapping(value = "/api/product/updateProduct", consumes = MULTIPART_FORM_DATA_VALUE)
	@Operation(summary = "Update product information", description = "API to update existing product details")
	public ResponseEntity<String> editProductDetails(@ModelAttribute("product") ProductDTO productDTO,
			@RequestPart("file") MultipartFile file) throws IOException {

		return ResponseEntity.ok().body(" successful");
	}

	@DeleteMapping("/api/product/removeProduct/{id}")
	@Operation(summary = "Delete product", description = "API to delete product")
	public ResponseEntity<String> removeProduct(@PathVariable Long id) {

		return ResponseEntity.ok().body(" successful");
	}

	@PostMapping("/api/product/bulkUpdateProducts/{userBusinessProfileId}")
	public ResponseEntity<String> updateProducts(@RequestBody List<ProductDTO> products,
			@PathVariable Long userBusinessProfileId) {

		return ResponseEntity.ok().body(" successful");
	}
	
	@GetMapping("/api/product/viewProductDetails")
	public ResponseEntity<ProductDTO> viewProductDetails(@PathVariable Long id)
			throws IOException {
		
		ProductDTO product = new ProductDTO();
		// fileName=fileName.replace("-", " ");
		// fileName=fileName.replace(".jpg", " ");
		product.setName("dummy");

		// String imageUrl =
		// ServletUriComponentsBuilder.fromCurrentContextPath().path("/"+category+"/")
		// .path(resource.getFilename()).toUriString();

		String imageUrl = accessUrl + "grocery/Aashirvaad-Black-Pepper-Pure-Kali-Mirch.jpg";

		product.setImage(imageUrl);
		product.setCategory("grocery");
		product.setMoreAbout("Aashirvaad-Black-Pepper-Pure-Kali-Mirch.jpg");
		product.setOfferPrice(100d);
		product.setPrice(120d);
		product.setQuantity(10);
		product.setDescription("good product");
		product.setUserBusinessProfileId(1l);
		product.setId(id);
		product.setStarRating(4.5);
		
		return  ResponseEntity.ok(product);
	}

	private void populateDefaultProduct(Long userProfileId, List<ProductDTO> products, Long id, String category) {

		File folder = new File(uploadDir + category.toLowerCase() + "/");

		// for (Resource resource : resources) {
		for (File file : folder.listFiles()) {

			id = id + 1;
			String fileName = file.getName();

			if (fileName.endsWith(".jpg") || fileName.endsWith(".png") || fileName.endsWith(".jpeg")) {
				ProductDTO product = new ProductDTO();
				// fileName=fileName.replace("-", " ");
				// fileName=fileName.replace(".jpg", " ");
				product.setName(fileName);

				// String imageUrl =
				// ServletUriComponentsBuilder.fromCurrentContextPath().path("/"+category+"/")
				// .path(resource.getFilename()).toUriString();

				String imageUrl = accessUrl + category.toLowerCase() + "/" + fileName;

				product.setImage(imageUrl);
				product.setCategory(category);
				product.setMoreAbout(fileName);
				product.setOfferPrice(100d);
				product.setPrice(120d);
				product.setQuantity(10);
				product.setDescription("good product");
				product.setUserBusinessProfileId(userProfileId);
				product.setId(id);
				product.setStarRating(4.5);

				products.add(product);

			}
		}
	}

}
