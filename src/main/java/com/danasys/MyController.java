package com.danasys;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.core.io.support.PathMatchingResourcePatternResolver;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import com.danasys.dto.LoginMobileRequest;
import com.danasys.dto.LoginRequest;
import com.danasys.dto.ProductCategoryDTO;
import com.danasys.dto.ProductCategoryEnum;
import com.danasys.dto.ProductDTO;
import com.danasys.dto.StatusEnum;
import com.danasys.dto.UserDTO;
import com.danasys.dto.UserDetailsDTO;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;


@RestController
@RequestMapping
@Tag(name = "Danasys API's", description = "APIs for danasys e-commerce functionality")
public class MyController {
	
	@Value("${file.upload-dir}")
	private String uploadDir;

	@Value("${file.access-url}")
	private String accessUrl;
	

	@PostMapping("/public/login")
	@Operation(summary = "Authenticate user", description = "Using user credential authenticate user")
	public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
		return ResponseEntity.ok().body("Login successful");
	}

	@PostMapping("/public/loginM")
	@Operation(summary = "Authenticate user", description = "Using user credential authenticate user")
	public ResponseEntity<?> loginUsingMobile(@RequestBody LoginMobileRequest loginRequest) {
		return ResponseEntity.ok().body("Login successful");

	}

	@PostMapping("/public/registerUser")
	public ResponseEntity<?> registerUser(@RequestBody UserDTO userDto) {
		return ResponseEntity.ok("User registered successfully");
	}

	@PostMapping("/public/registerUser/sendEmailOTP")
	public ResponseEntity<?> sendOTP(@RequestBody UserDTO userDto) {
		return ResponseEntity.ok("OTP Send to email id");
	}
	
	@PostMapping("/public/registerUser/sendMobileOTP")
	public ResponseEntity<?> sendOTP(@RequestBody LoginMobileRequest loginRequest) {
		return ResponseEntity.ok("OTP Send to email id");
	}

	@GetMapping("/api/user/getUserDetails")
	@Operation(summary = "Get user details", description = "API for get user details")
	public UserDetailsDTO getUserDetails() {
		UserDetailsDTO userDetailsDTO = new UserDetailsDTO();

		userDetailsDTO.setContactInfo("+91-91111111111");
		userDetailsDTO.setEmail("dana@dana.com");
		userDetailsDTO.setFullname("Sri Ram");
		userDetailsDTO.setStatus(StatusEnum.ACTIVE);
		userDetailsDTO.setAddress("House No-102, Pocket-5, Noida Sec-62, UP-201301");

		String imageUrl = ServletUriComponentsBuilder.fromCurrentContextPath().path("/userdata/").path("user.jpg")
				.toUriString();

		userDetailsDTO.setUserProfilePicture(imageUrl);
		List<String> dealOfTheDayImages = new ArrayList<>();

		String imageUrl2 = ServletUriComponentsBuilder.fromCurrentContextPath().path("/userdata/").path("add1.png")
				.toUriString();

		String imageUrl3 = ServletUriComponentsBuilder.fromCurrentContextPath().path("/userdata/").path("add2.png")
				.toUriString();

		dealOfTheDayImages.add(imageUrl2);
		dealOfTheDayImages.add(imageUrl3);
		userDetailsDTO.setDealOfTheDayImages(dealOfTheDayImages);

		String greeting = ServletUriComponentsBuilder.fromCurrentContextPath().path("/userdata/").path("greeting.png")
				.toUriString();
		
		userDetailsDTO.setGreetingOfTheDay(greeting);
		
		return userDetailsDTO;
	}

	@GetMapping("/api/product/productList")
	@Operation(summary = "Product list", description = "Provide list of product for registered user")
	public List<ProductDTO> productList() throws IOException {

		List<ProductDTO> prodicts = getAllOtherProducts(1l);

		return prodicts;

	}

	@GetMapping("/api/product/productCategoryList")
	@Operation(summary = "Product category list", description = "All listed product category")
	public List<ProductCategoryDTO> productCategoryList() throws IOException {

		List<ProductCategoryDTO> list = new ArrayList<>();
		ProductCategoryDTO dto1 = new ProductCategoryDTO();
		dto1.setId(1l);
		dto1.setCategoryName(ProductCategoryEnum.Grocery);
		dto1.setDescription("Grocery products");
		dto1.setStatus(StatusEnum.ACTIVE);
		String imageUrl = ServletUriComponentsBuilder.fromCurrentContextPath().path("/category/").path("grocery.png")
				.toUriString();

		dto1.setImage(imageUrl);
		dto1.setTheemColorCode("#228B22");

		ProductCategoryDTO dto2 = new ProductCategoryDTO();
		dto2.setId(2l);
		dto2.setCategoryName(ProductCategoryEnum.Vegetables);
		dto2.setDescription("Vegitables items including fruits");
		dto2.setStatus(StatusEnum.ACTIVE);
		String imageUrl2 = ServletUriComponentsBuilder.fromCurrentContextPath().path("/category/")
				.path("vegetable.png").toUriString();

		dto2.setImage(imageUrl2);
		dto2.setTheemColorCode("#228B22");

		ProductCategoryDTO dto3 = new ProductCategoryDTO();
		dto3.setId(3l);
		dto3.setCategoryName(ProductCategoryEnum.Fashion);
		dto3.setDescription("Fashon");
		dto3.setStatus(StatusEnum.ACTIVE);
		String imageUrl3 = ServletUriComponentsBuilder.fromCurrentContextPath().path("/category/").path("fashion.png")
				.toUriString();

		dto3.setImage(imageUrl3);
		dto3.setTheemColorCode("#228B22");

		ProductCategoryDTO dto4 = new ProductCategoryDTO();
		dto4.setId(4l);
		dto4.setCategoryName(ProductCategoryEnum.RonyRocket);
		dto4.setDescription("Delivery partner");
		dto4.setStatus(StatusEnum.ACTIVE);
		String imageUrl4 = ServletUriComponentsBuilder.fromCurrentContextPath().path("/category/").path("rr.png")
				.toUriString();

		dto4.setImage(imageUrl4);
		dto4.setTheemColorCode("#228B22");
		
		ProductCategoryDTO dto5 = new ProductCategoryDTO();
		dto5.setId(5l);
		dto5.setCategoryName(ProductCategoryEnum.RonyRocket);
		dto5.setDescription("Delivery partner");
		dto5.setStatus(StatusEnum.ACTIVE);
		String imageUrl5 = ServletUriComponentsBuilder.fromCurrentContextPath().path("/category/").path("electronics.png")
				.toUriString();

		dto5.setImage(imageUrl5);
		dto5.setTheemColorCode("#228B22");

		list.add(dto1);
		list.add(dto2);
		list.add(dto3);
		list.add(dto4);
		list.add(dto5);

		return list;
	}

	public List<ProductDTO> getAllOtherProducts(Long userProfileId) throws IOException {
		PathMatchingResourcePatternResolver resolver = new PathMatchingResourcePatternResolver();
		Resource[] resources = resolver.getResources("classpath:static/grocery/*.*");
		List<ProductDTO> products = new ArrayList();
		Long id = 100000l;
		populateDefaultProduct(userProfileId, resources, products, id,ProductCategoryEnum.Grocery.name());
		
		resources = resolver.getResources("classpath:static/vegetables/*.*");
		id = 200000l;
		populateDefaultProduct(userProfileId, resources, products, id,ProductCategoryEnum.Vegetables.name());
		
		resources = resolver.getResources("classpath:static/fashion/*.*");
		id = 300000l;
		populateDefaultProduct(userProfileId, resources, products, id,ProductCategoryEnum.Fashion.name());
		
		resources = resolver.getResources("classpath:static/ronyrocket/*.*");
		id = 400000l;
		populateDefaultProduct(userProfileId, resources, products, id,ProductCategoryEnum.RonyRocket.name());
		
		resources = resolver.getResources("classpath:static/electronics/*.*");
		id = 500000l;
		populateDefaultProduct(userProfileId, resources, products, id,ProductCategoryEnum.Electronics.name());

		return products;
	}

	private void populateDefaultProduct(Long userProfileId, Resource[] resources, List<ProductDTO> products, Long id, String category) {
		for (Resource resource : resources) {
			id = id + 1;
			String fileName = resource.getFilename().toLowerCase();

			if (fileName.endsWith(".jpg") || fileName.endsWith(".png") || fileName.endsWith(".jpeg")) {
				ProductDTO product = new ProductDTO();
				product.setName(fileName);

				//String imageUrl = ServletUriComponentsBuilder.fromCurrentContextPath().path("/"+category+"/")
				//		.path(resource.getFilename()).toUriString();
				
				String imageUrl = accessUrl+category+"/"+resource.getFilename();

				product.setImage(imageUrl);
				product.setCategory(category);
				product.setMoreAbout("good product");
				product.setOfferPrice(100d);
				product.setPrice(120d);
				product.setQuantity(10);
				product.setDescription("good product");
				product.setBusinessUserProfileId(userProfileId);
				product.setId(id);

				products.add(product);

			}
		}
	}
	
	@GetMapping({
	    "/api/product/images/Grocery/{filename:.+}",
	    "/api/product/images/Vegetables/{filename:.+}",
	    "/api/product/images/Fashion/{filename:.+}",
	    "/api/product/images/Electronics/{filename:.+}",
	    "/api/product/images/RonyRocket/{filename:.+}"
	})
	public ResponseEntity<Resource> getImage(HttpServletRequest request, @PathVariable String filename)
			throws MalformedURLException {
		Resource resource = loadImages(request, filename);
		String contentType = "image/jpeg"; // adjust based on file type if needed
		return ResponseEntity.ok().contentType(MediaType.parseMediaType(contentType)).body(resource);
	}

	private Resource loadImages(HttpServletRequest request, String filename) throws MalformedURLException {
		String requestURI = request.getRequestURI();
		String newUploadDir = uploadDir;
		if (requestURI.contains("images/Grocery")) {
			newUploadDir = uploadDir + "grocery/";
		}else if (requestURI.contains("images/Vegetables")) {
			newUploadDir = uploadDir + "vegetables/";
		}else if (requestURI.contains("images/Fashion")) {
			newUploadDir = uploadDir + "fashion/";
		}else if (requestURI.contains("images/Electronics")) {
			newUploadDir = uploadDir + "electronics/";
		}else if (requestURI.contains("images/RonyRocket")) {
			newUploadDir = uploadDir + "ronyrocket/";
		}

		Path imagePath = Paths.get(newUploadDir).resolve(filename);
		Resource resource = new UrlResource(imagePath.toUri());

		if (!resource.exists()) {
			return (Resource) ResponseEntity.notFound().build();
		}
		return resource;
	}
}
