package com.danasys;

import java.io.File;
import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.security.Principal;
import java.util.ArrayList;
import java.util.List;

import org.apache.tomcat.util.net.openssl.ciphers.Authentication;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.core.io.support.PathMatchingResourcePatternResolver;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import com.danasys.dto.BusinessDashboaardFunctionalityDTO;
import com.danasys.dto.BusinessProfileDetailsDTO;
import com.danasys.dto.LoginMobileRequest;
import com.danasys.dto.LoginRequest;
import com.danasys.dto.LoginTheemDTO;
import com.danasys.dto.ProductCategoryDTO;
import com.danasys.dto.ProductCategoryEnum;
import com.danasys.dto.ProductCategorySADetailsDTO;
import com.danasys.dto.ProductDTO;
import com.danasys.dto.StatusEnum;
import com.danasys.dto.UserBusinessDashboardDTO;
import com.danasys.dto.UserBusinessProfileDTO;
import com.danasys.dto.RegisterUserRequest;
import com.danasys.dto.ServiceAreaDetails;
import com.danasys.dto.UserDetailsDTO;
import com.danasys.user.enums.UserRoleEnum;
import com.danasys.user.request.BusinessProfileRequest;
import com.danasys.user.request.ResetPasswordRequest;
import com.danasys.user.request.UpdateBusinessProfileRequest;
import com.danasys.user.request.UserBusinessProfilesRequest;
import com.danasys.user.request.UserPasswordRequest;
import com.danasys.user.request.UserProfileUpdateRequest;
import com.danasys.user.request.UserServiceAreaRequest;
import com.danasys.user.response.UserAddresses;
import com.danasys.user.response.UserServiceArea;

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
	//User Registration API - start
	@PostMapping("/public/registerUser")
	public ResponseEntity<?> registerUser(@RequestBody RegisterUserRequest userDto) {
		return ResponseEntity.ok("User Registered and select your service Area and Update your profile. Please check your email for your ReferalCode.");
	}
	@PostMapping("/public/forgotPassword")
	@Operation(summary = "forgot password", description = "forgot password for user.")
	public ResponseEntity<?> forgotPassword(@RequestParam String email) {
		return ResponseEntity.ok("Reset link sent to your email : " + email + ". Please check your inbox.");
	}

	@PostMapping("/public/resetPassword")
	@Operation(summary = "Reset the user password", description = "Reset the user password using a token.")
	public ResponseEntity<?> resetPassword(@RequestBody ResetPasswordRequest req) {
		return ResponseEntity.ok("Password reset with status: SUCCESS");
	}

		
	@PostMapping("/public/sendEmailOTP")
	@Operation(summary = "send OTP to email for registration", description = "OTP sent to email for registration.")
	public ResponseEntity<?> sendEmailOTP(@RequestParam String email) {
		return ResponseEntity.ok("OTP Send to your email id. Please check your inbox for registration.");
	}

	@PostMapping("/public/sendMobileOTP")
	public ResponseEntity<?> sendOTP(@RequestParam String mobileNumber) {
		return ResponseEntity.ok("OTP Send to phone number : " + mobileNumber + ". Please check your messages.");
	}
	/*
	 * @PostMapping("/public/registerUser/sendEmailOTP") public ResponseEntity<?>
	 * sendOTP(@RequestBody RegisterUserRequest userDto) { return
	 * ResponseEntity.ok("OTP Send to email id"); }
	 */
	//User Registration API - start
	
	// user Info API start --
	@PostMapping("/api/user/linkServiceArea")
	@Operation(summary = "Request to link new service area", description = "API to request to link service area")
	public ResponseEntity<?> linkServiceArea(@RequestBody UserServiceAreaRequest userServiceAreaRequest,
			Principal principal) throws IOException {
		return ResponseEntity.ok("Service area added successfully to user.");
	}

	
	
	@GetMapping("/api/user/loadUserAddresses")
	@Operation(summary = "load all user addresses", description = "load all user addresses.")
	public ResponseEntity<?> loadUserAddressList() throws IOException {
		List<UserAddresses> userAddressList = new ArrayList();
		UserAddresses address1 = new UserAddresses();
		address1.setId(11l);
		address1.setAddress("E2 702, Paramount Golfforeste, UPSIDC, Greater Noida, UP - 201309");
		address1.setDefault(true);
		userAddressList.add(address1);
		
		UserAddresses address2 = new UserAddresses();
		address2.setId(12l);
		address2.setAddress("F - 504 , Paramount Golfforeste, UPSIDC, Greater Noida, UP - 201309");
		address2.setDefault(true);
		userAddressList.add(address2);
		
		
		return ResponseEntity.ok(userAddressList);

	}

	
	@PutMapping("/api/user/setUserDefaultAddresses/{id}")
	@Operation(summary = "Set selected address as user deafult address", description = "Set selected address as user deafult address.")
	public ResponseEntity<?> setUserDefaultAddresses(@PathVariable Long id, Principal principal)
			throws IOException {
		return ResponseEntity.ok("User address status updated as default.");
	}

	@PostMapping(value = "/api/user/updateUserPassword")
	@Operation(summary = "Change user password", description = "Change user password.")
	public ResponseEntity<?> updateUserPassword(@RequestBody UserPasswordRequest userPasswordRequest,
			Principal principal) {
			return ResponseEntity.ok("SUCCESS: Password changed successfully");
	}


	@PostMapping(value = "/api/user/updateUserProfile")
	@Operation(summary = "update user profile", description = "Update user prfofile.")
	public ResponseEntity<?> updateUserProfile(@RequestBody UserProfileUpdateRequest userProfileUpdateRequest,
			Principal principal) {
		return ResponseEntity.ok("SUCCESS: User profile updated and service area is valid");
	}

	@PostMapping(value = "/api/user/createUserBusinessProfile")
	@Operation(summary = "Create user Business profile", description = "Create user Business profile.")
	public ResponseEntity<?> createUserBusinessProfile(@RequestBody BusinessProfileRequest createBusinessProfileRequest,Principal principal) {
		return ResponseEntity.ok("SUCCESS: Business profile created sucessfully for user: Test User");

	}
	@PostMapping(value = "/api/user/updateUserBusinessProfile")
	@Operation(summary = "Update user Business profile", description = "Update user Business profile.")
	public ResponseEntity<?> updateUserBusinessProfile(
			@RequestBody UpdateBusinessProfileRequest updateBusinessProfileRequest, Principal principal) {
		return ResponseEntity.ok("SUCCESS: Business profile updated sucessfully for user: Test User");
	}
	//user Info API end --
	

	@GetMapping("/api/user/getUserDetails")
	@Operation(summary = "Get user details", description = "API for get user details")
	public UserDetailsDTO getUserDetails() {
		UserDetailsDTO userDetailsDTO = new UserDetailsDTO();

		userDetailsDTO.setContactInfo("+91-91111111111");
		userDetailsDTO.setEmail("dana@dana.com");
		userDetailsDTO.setFullname("Sri Ram");
		userDetailsDTO.setStatus(StatusEnum.ACTIVE);
		userDetailsDTO.setServiceAreaId(5l);
		userDetailsDTO.setHouseNo("House no-102");
		userDetailsDTO.setFullAddress("House No-102, Pocket-5, Noida Sec-62, UP-201301");
		userDetailsDTO.setRole(UserRoleEnum.ROLE_USER);

		String imageUrl = ServletUriComponentsBuilder.fromCurrentContextPath().path("/api/product/images/userdata/").path("user.png")
				.toUriString();

		userDetailsDTO.setUserProfilePicture(imageUrl);
		List<String> dealOfTheDayImages = new ArrayList<>();

		String imageUrl2 = ServletUriComponentsBuilder.fromCurrentContextPath().path("/api/product/images/userdata/").path("add1.png")
				.toUriString();

		String imageUrl3 = ServletUriComponentsBuilder.fromCurrentContextPath().path("/api/product/images/userdata/").path("add2.png")
				.toUriString();

		dealOfTheDayImages.add(imageUrl2);
		dealOfTheDayImages.add(imageUrl3);
		dealOfTheDayImages.add(imageUrl2);
		dealOfTheDayImages.add(imageUrl3);
		dealOfTheDayImages.add(imageUrl2);
		dealOfTheDayImages.add(imageUrl3);
		userDetailsDTO.setDealOfTheDayImages(dealOfTheDayImages);

		String greeting = ServletUriComponentsBuilder.fromCurrentContextPath().path("/api/product/images/userdata/").path("greeting.png")
				.toUriString();
		
		userDetailsDTO.setGreetingOfTheDay(greeting);
		
		String wallet = ServletUriComponentsBuilder.fromCurrentContextPath().path("/api/product/images/userdata/").path("wallet.png")
				.toUriString();
		
		userDetailsDTO.setUserWalletImage(wallet);
		return userDetailsDTO;
	}
	
	@GetMapping("/api/user/serviceAreaList")
	@Operation(summary = "load all service area Areas", description = "load all service area Areas.")
	public  ServiceAreaDetails serviceAreaList(){
		
		ServiceAreaDetails details = new ServiceAreaDetails();
		List<UserServiceArea> userServiceAreaList = new ArrayList<>();
		
			UserServiceArea userServiceAreaItem1 = new UserServiceArea();
			userServiceAreaItem1.setId(1l);
			userServiceAreaItem1.setFullAddress("Paramount Golfforeste, UPSIDC");
			userServiceAreaItem1.setDistrict("Greater Noida");
			userServiceAreaItem1.setState("UP");
			userServiceAreaItem1.setPinCode(201309);
			userServiceAreaItem1.setStatus(StatusEnum.ACTIVE);
			
		
		
			UserServiceArea userServiceAreaItem2 = new UserServiceArea();
			userServiceAreaItem2.setId(2l);
			userServiceAreaItem2.setFullAddress("Panchsheel Greens 2");
			userServiceAreaItem2.setDistrict("Sector 16B");
			userServiceAreaItem2.setState("Greater Noida");
			userServiceAreaItem2.setPinCode(201306);
			userServiceAreaItem2.setStatus(StatusEnum.ACTIVE);
			
			UserServiceArea userServiceAreaItem3 = new UserServiceArea();
			userServiceAreaItem3.setId(3l);
			userServiceAreaItem3.setFullAddress("Dummy Service area");
			userServiceAreaItem3.setDistrict("Sector 16B");
			userServiceAreaItem3.setState("Greater Noida");
			userServiceAreaItem3.setPinCode(201306);
			userServiceAreaItem3.setStatus(StatusEnum.ACTIVE);
			
			userServiceAreaList.add(userServiceAreaItem1);
			userServiceAreaList.add(userServiceAreaItem2);
			userServiceAreaList.add(userServiceAreaItem3);

		
			details.setUserServiceAreaList(userServiceAreaList);
			
			
		return  details;

	} 

	@GetMapping("/api/product/productList")
	@Operation(summary = "Product list", description = "Provide list of product for registered user")
	public List<ProductDTO> productList() throws IOException {

		List<ProductDTO> prodicts = getAllOtherProducts(1l);

		return prodicts;

	}
	
	@GetMapping("/api/user/loginTheem")
	@Operation(summary = "Login theem", description = "Login theem APIr")
	public LoginTheemDTO loginTheem() throws IOException {

		LoginTheemDTO theem = new LoginTheemDTO();
		String backGroundImage = ServletUriComponentsBuilder.fromCurrentContextPath().path("/api/product/images/userdata/").path("background.jpg")
				.toUriString();
		
		String compenyLogo = ServletUriComponentsBuilder.fromCurrentContextPath().path("/api/product/images/userdata/").path("logo.png")
				.toUriString();
		
		theem.setBackGroundImageURL(backGroundImage);
		theem.setCompenyLogo(compenyLogo);

		return theem;

	}

	//@GetMapping("/api/product/productCategoryList")
	//@Operation(summary = "Product category list", description = "All listed product category")
	public List<ProductCategoryDTO> productCategoryList() throws IOException {

		List<ProductCategoryDTO> list = new ArrayList<>();
		ProductCategoryDTO dto1 = new ProductCategoryDTO();
		dto1.setId(1l);
		dto1.setCategoryName(ProductCategoryEnum.Grocery);
		dto1.setDescription("Grocery products");
		dto1.setStatus(StatusEnum.ACTIVE);
		String imageUrl = ServletUriComponentsBuilder.fromCurrentContextPath().path("/api/product/images/category/").path("grocery.png")
				.toUriString();

		dto1.setImage(imageUrl);
		dto1.setTheemColorCode("#228B22");

		ProductCategoryDTO dto2 = new ProductCategoryDTO();
		dto2.setId(2l);
		dto2.setCategoryName(ProductCategoryEnum.Vegetables);
		dto2.setDescription("Vegitables items including fruits");
		dto2.setStatus(StatusEnum.ACTIVE);
		String imageUrl2 = ServletUriComponentsBuilder.fromCurrentContextPath().path("/api/product/images/category/")
				.path("vegetable.png").toUriString();

		dto2.setImage(imageUrl2);
		dto2.setTheemColorCode("#228B22");

		ProductCategoryDTO dto3 = new ProductCategoryDTO();
		dto3.setId(3l);
		dto3.setCategoryName(ProductCategoryEnum.Fashion);
		dto3.setDescription("Fashon");
		dto3.setStatus(StatusEnum.ACTIVE);
		String imageUrl3 = ServletUriComponentsBuilder.fromCurrentContextPath().path("/api/product/images/category/").path("fashion.png")
				.toUriString();

		dto3.setImage(imageUrl3);
		dto3.setTheemColorCode("#228B22");

		ProductCategoryDTO dto4 = new ProductCategoryDTO();
		dto4.setId(4l);
		dto4.setCategoryName(ProductCategoryEnum.RonyRocket);
		dto4.setDescription("Delivery partner");
		dto4.setStatus(StatusEnum.ACTIVE);
		String imageUrl4 = ServletUriComponentsBuilder.fromCurrentContextPath().path("/api/product/images/category/").path("ronyrocket.png")
				.toUriString();

		dto4.setImage(imageUrl4);
		dto4.setTheemColorCode("#228B22");
		
		ProductCategoryDTO dto5 = new ProductCategoryDTO();
		dto5.setId(5l);
		dto5.setCategoryName(ProductCategoryEnum.Electronics);
		dto5.setDescription("Delivery partner");
		dto5.setStatus(StatusEnum.ACTIVE);
		String imageUrl5 = ServletUriComponentsBuilder.fromCurrentContextPath().path("/api/product/images/category/").path("electronics.png")
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
	
	@GetMapping("/api/user/productCategoryList/{serviceArea}")
	@Operation(summary = "Product category list", description = "All listed product category")
	public List<ProductCategorySADetailsDTO> findAllCategoryByServiceArea(@PathVariable Long serviceArea){
		List<ProductCategorySADetailsDTO> productCategoryDTOList = new ArrayList<>();
		
		ProductCategorySADetailsDTO cat1 = new ProductCategorySADetailsDTO();
		cat1.setId(1l);
		cat1.setCategoryName(ProductCategoryEnum.Grocery);
		String imageUrl1 = ServletUriComponentsBuilder.fromCurrentContextPath().path("/api/product/images/category/").path("grocery.png")
				.toUriString();
		cat1.setImage(imageUrl1);
		cat1.setTheemColorCode("#228B22");
		
		BusinessProfileDetailsDTO b1 = new BusinessProfileDetailsDTO();
		b1.setId(1l);
		b1.setBusinessLogoPath(imageUrl1);
		b1.setStoreName("Gupta Ji General Store");
		
		BusinessProfileDetailsDTO b2 = new BusinessProfileDetailsDTO();
		b2.setId(2l);
		b2.setBusinessLogoPath(imageUrl1);
		b2.setStoreName("Bansal Ji General Store");
		
		List<BusinessProfileDetailsDTO> bList = new ArrayList<>();
		bList.add(b2);
		bList.add(b1);
		cat1.setLinkedBusinessProfile(bList);
		
		//CAT 2
		ProductCategorySADetailsDTO cat2 = new ProductCategorySADetailsDTO();
		cat2.setId(2l);
		cat2.setCategoryName(ProductCategoryEnum.Vegetables);
		String imageUrl2 = ServletUriComponentsBuilder.fromCurrentContextPath().path("/api/product/images/category/").path("vegetable.png")
				.toUriString();
		cat2.setImage(imageUrl2);
		cat2.setTheemColorCode("#228B22");
		
		BusinessProfileDetailsDTO b3 = new BusinessProfileDetailsDTO();
		b3.setId(3l);
		b3.setBusinessLogoPath(imageUrl2);
		b3.setStoreName("Ramu vegetable Store");
		List<BusinessProfileDetailsDTO> bList2 = new ArrayList<>();
		bList2.add(b3);
		cat2.setLinkedBusinessProfile(bList2);
		
		
		//CAT 3
				ProductCategorySADetailsDTO cat3 = new ProductCategorySADetailsDTO();
				cat3.setId(3l);
				cat3.setCategoryName(ProductCategoryEnum.Fashion);
				String imageUrl3 = ServletUriComponentsBuilder.fromCurrentContextPath().path("/api/product/images/category/").path("fashion.png")
						.toUriString();
				cat3.setImage(imageUrl3);
				cat3.setTheemColorCode("#228B22");
				
				BusinessProfileDetailsDTO b4 = new BusinessProfileDetailsDTO();
				b4.setId(4l);
				b4.setBusinessLogoPath(imageUrl3);
				b4.setStoreName("Ramu vegetable Store");
				List<BusinessProfileDetailsDTO> bList3 = new ArrayList<>();
				bList3.add(b4);
				cat3.setLinkedBusinessProfile(bList3);
		
				//CAT 4
				ProductCategorySADetailsDTO cat4 = new ProductCategorySADetailsDTO();
				cat4.setId(4l);
				cat4.setCategoryName(ProductCategoryEnum.Electronics);
				String imageUrl4 = ServletUriComponentsBuilder.fromCurrentContextPath().path("/api/product/images/category/").path("electronics.png")
						.toUriString();
				cat4.setImage(imageUrl4);
				cat4.setTheemColorCode("#228B22");
				
				//CAT 5
				ProductCategorySADetailsDTO cat5 = new ProductCategorySADetailsDTO();
				cat5.setId(5l);
				cat5.setCategoryName(ProductCategoryEnum.RonyRocket);
				String imageUrl5 = ServletUriComponentsBuilder.fromCurrentContextPath().path("/api/product/images/category/").path("ronyrocket.png")
						.toUriString();
				cat5.setImage(imageUrl5);
				cat5.setTheemColorCode("#228B22");

				productCategoryDTOList.add(cat1);
				productCategoryDTOList.add(cat2);
				productCategoryDTOList.add(cat3);
				productCategoryDTOList.add(cat4);
				productCategoryDTOList.add(cat5);
				
		return productCategoryDTOList;
	}

	public List<ProductDTO> getAllOtherProducts(Long userProfileId) throws IOException {
		PathMatchingResourcePatternResolver resolver = new PathMatchingResourcePatternResolver();
		//Resource[] resources = resolver.getResources("classpath:static/grocery/*.*");
		List<ProductDTO> products = new ArrayList();
		Long id = 100000l;
		populateDefaultProduct(userProfileId, products, id,ProductCategoryEnum.Grocery.name());
		
		//resources = resolver.getResources("classpath:static/vegetables/*.*");
		id = 200000l;
		populateDefaultProduct(userProfileId, products, id,ProductCategoryEnum.Vegetables.name());
		
		//resources = resolver.getResources("classpath:static/fashion/*.*");
		id = 300000l;
		populateDefaultProduct(userProfileId, products, id,ProductCategoryEnum.Fashion.name());
		
		//resources = resolver.getResources("classpath:static/ronyrocket/*.*");
		id = 400000l;
		populateDefaultProduct(userProfileId, products, id,ProductCategoryEnum.RonyRocket.name());
		
		//resources = resolver.getResources("classpath:static/electronics/*.*");
		id = 500000l;
		populateDefaultProduct(userProfileId, products, id,ProductCategoryEnum.Electronics.name());

		return products;
	}

	private void populateDefaultProduct(Long userProfileId, List<ProductDTO> products, Long id, String category) {
		
		File folder = new File(uploadDir + category.toLowerCase() + "/");
		
		
		
		//for (Resource resource : resources) {
		for (File file : folder.listFiles()) {
			
			id = id + 1;
			String fileName = file.getName();
			

			if (fileName.endsWith(".jpg") || fileName.endsWith(".png") || fileName.endsWith(".jpeg")) {
				ProductDTO product = new ProductDTO();
				//fileName=fileName.replace("-", " ");
				//fileName=fileName.replace(".jpg", " ");
				product.setName(fileName);

				//String imageUrl = ServletUriComponentsBuilder.fromCurrentContextPath().path("/"+category+"/")
				//		.path(resource.getFilename()).toUriString();
				
				String imageUrl = accessUrl+category.toLowerCase()+"/"+fileName;

				product.setImage(imageUrl);
				product.setCategory(category);
				product.setMoreAbout("good product");
				product.setOfferPrice(100d);
				product.setPrice(120d);
				product.setQuantity(10);
				product.setDescription("good product");
				product.setBusinessUserProfileId(userProfileId);
				product.setId(id);
				product.setStarRating(4.5);

				products.add(product);

			}
		}
	}
	
	@GetMapping({
	    "/api/product/images/grocery/{filename:.+}",
	    "/api/product/images/vegetables/{filename:.+}",
	    "/api/product/images/fashion/{filename:.+}",
	    "/api/product/images/electronics/{filename:.+}",
	    "/api/product/images/ronyrocket/{filename:.+}",
	    "/api/product/images/category/{filename:.+}",
	    "/api/product/images/userdata/{filename:.+}"
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
		if (requestURI.contains("images/grocery")) {
			newUploadDir = uploadDir + "grocery/";
		}else if (requestURI.contains("images/vegetables")) {
			newUploadDir = uploadDir + "vegetables/";
		}else if (requestURI.contains("images/fashion")) {
			newUploadDir = uploadDir + "fashion/";
		}else if (requestURI.contains("images/electronics")) {
			newUploadDir = uploadDir + "electronics/";
		}else if (requestURI.contains("images/ronyrocket")) {
			newUploadDir = uploadDir + "ronyrocket/";
		}else if (requestURI.contains("images/category")) {
			newUploadDir = uploadDir + "category/";
		}else if (requestURI.contains("images/userdata")) {
			newUploadDir = uploadDir + "userdata/";
		}

		Path imagePath = Paths.get(newUploadDir).resolve(filename);
		Resource resource = new UrlResource(imagePath.toUri());

		if (!resource.exists()) {
			return (Resource) ResponseEntity.notFound().build();
		}
		return resource;
	}
	
	
	@GetMapping("/loadBusinessUserDashboard/{userProfileId}")
	public ResponseEntity<?> loadBusinessUserDashboard(@PathVariable Long userProfileId) {
		
		UserBusinessDashboardDTO buDashboard = new UserBusinessDashboardDTO();
		
		List<UserBusinessProfileDTO> userBusinessProfileDTOList = new ArrayList<>();
		UserBusinessProfileDTO bp = new UserBusinessProfileDTO();
		
		String imageUrl = ServletUriComponentsBuilder.fromCurrentContextPath().path("/api/product/images/userdata/").path("guptastore.png")
				.toUriString();
		bp.setId(1l);
		bp.setBusinessLogoPath(imageUrl);
		bp.setOwnerName("Ramesh Gupta");
		bp.setStoreName("Gupta general Store");
		
		String imageUrl1 = ServletUriComponentsBuilder.fromCurrentContextPath().path("/api/product/images/userdata/").path("guptaveg.png")
				.toUriString();
		
		UserBusinessProfileDTO bp1 = new UserBusinessProfileDTO();
		bp1.setBusinessLogoPath(imageUrl1);
		bp1.setOwnerName("Ramesh Gupta");
		bp1.setStoreName("Gupta Vegitable SHOP");
		bp1.setId(2l);
		
		userBusinessProfileDTOList.add(bp);
		userBusinessProfileDTOList.add(bp1);
		
		
		List<BusinessDashboaardFunctionalityDTO> buIconDetails = new ArrayList<>();
		
		String ic1 = ServletUriComponentsBuilder.fromCurrentContextPath().path("/api/product/images/userdata/").path("guptaveg.png")
				.toUriString();
		String ic2 = ServletUriComponentsBuilder.fromCurrentContextPath().path("/api/product/images/userdata/").path("guptaveg.png")
				.toUriString();
		String ic3 = ServletUriComponentsBuilder.fromCurrentContextPath().path("/api/product/images/userdata/").path("guptaveg.png")
				.toUriString();
		String ic4 = ServletUriComponentsBuilder.fromCurrentContextPath().path("/api/product/images/userdata/").path("guptaveg.png")
				.toUriString();
		String ic5 = ServletUriComponentsBuilder.fromCurrentContextPath().path("/api/product/images/userdata/").path("guptaveg.png")
				.toUriString();
		String ic6 = ServletUriComponentsBuilder.fromCurrentContextPath().path("/api/product/images/userdata/").path("guptaveg.png")
				.toUriString();
		String ic7 = ServletUriComponentsBuilder.fromCurrentContextPath().path("/api/product/images/userdata/").path("guptaveg.png")
				.toUriString();
		String ic8 = ServletUriComponentsBuilder.fromCurrentContextPath().path("/api/product/images/userdata/").path("guptaveg.png")
				.toUriString();
		String ic9 = ServletUriComponentsBuilder.fromCurrentContextPath().path("/api/product/images/userdata/").path("guptaveg.png")
				.toUriString();
		String ic10 = ServletUriComponentsBuilder.fromCurrentContextPath().path("/api/product/images/userdata/").path("guptaveg.png")
				.toUriString();
		
		BusinessDashboaardFunctionalityDTO icone1 = new BusinessDashboaardFunctionalityDTO();
		icone1.setBuIconPath(ic1);
		icone1.setName("Business User");
		
		BusinessDashboaardFunctionalityDTO icone2 = new BusinessDashboaardFunctionalityDTO();
		icone2.setBuIconPath(ic2);
		icone2.setName("Product");
		
		BusinessDashboaardFunctionalityDTO icone3 = new BusinessDashboaardFunctionalityDTO();
		icone3.setBuIconPath(ic3);
		icone3.setName("Orders");
		
		BusinessDashboaardFunctionalityDTO icone4 = new BusinessDashboaardFunctionalityDTO();
		icone4.setBuIconPath(ic4);
		icone4.setName("Payments");
		
		
		BusinessDashboaardFunctionalityDTO icone5 = new BusinessDashboaardFunctionalityDTO();
		icone5.setBuIconPath(ic5);
		icone5.setName("Reports");
		
		BusinessDashboaardFunctionalityDTO icone6 = new BusinessDashboaardFunctionalityDTO();
		icone6.setBuIconPath(ic6);
		icone6.setName("Compemy Profile");
		
		BusinessDashboaardFunctionalityDTO icone7 = new BusinessDashboaardFunctionalityDTO();
		icone7.setBuIconPath(ic7);
		icone7.setName("Trend");
		
		BusinessDashboaardFunctionalityDTO icone8 = new BusinessDashboaardFunctionalityDTO();
		icone8.setBuIconPath(ic8);
		icone8.setName("Anual report");
		
		BusinessDashboaardFunctionalityDTO icone9 = new BusinessDashboaardFunctionalityDTO();
		icone9.setBuIconPath(ic9);
		icone9.setName("Activation");
		
		BusinessDashboaardFunctionalityDTO icone10 = new BusinessDashboaardFunctionalityDTO();
		icone10.setBuIconPath(ic10);
		icone10.setName("Communication");
		
		buIconDetails.add(icone2);
		buIconDetails.add(icone1);
		buIconDetails.add(icone3);
		buIconDetails.add(icone4);
		buIconDetails.add(icone5);
		buIconDetails.add(icone6);
		buIconDetails.add(icone7);
		buIconDetails.add(icone8);
		buIconDetails.add(icone9);
		buIconDetails.add(icone10);
		
		
		buDashboard.setBuIconDetails(buIconDetails);
		buDashboard.setUserBusinessProfileDTOList(userBusinessProfileDTOList);
		return ResponseEntity.ok(buDashboard);

	}
	
	@PostMapping(value = "/createUserBusinessProfile")
	public ResponseEntity<?> createUserBusinessProfile(@RequestBody BusinessProfileRequest createBusinessProfileRequest) {
		
		
		return ResponseEntity.ok("SUCCESS: Business profile created sucessfully");
	}
	
}
