package com.danasys;

import java.io.File;
import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.security.Principal;
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
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import com.danasys.dto.AddressDTO;
import com.danasys.dto.BankAccountDTO;
import com.danasys.dto.BusinessDashboaardFunctionalityDTO;
import com.danasys.dto.BusinessProfileDetailsDTO;
import com.danasys.dto.LoginMobileRequest;
import com.danasys.dto.LoginRequest;
import com.danasys.dto.LoginTheemDTO;
import com.danasys.dto.ProductCategoryDTO;
import com.danasys.dto.ProductCategoryEnum;
import com.danasys.dto.ProductCategorySADetailsDTO;
import com.danasys.dto.ProductDTO;
import com.danasys.dto.RegisterUserRequest;
import com.danasys.dto.ServiceAreaDTO;
import com.danasys.dto.ServiceAreaDetails;
import com.danasys.dto.StatusEnum;
import com.danasys.dto.UserBusinessDashboardDTO;
import com.danasys.dto.UserBusinessProfileDTO;
import com.danasys.dto.UserConnection;
import com.danasys.dto.UserDetailsDTO;
import com.danasys.dto.UserProfileDTO;
import com.danasys.user.enums.UserRoleEnum;
import com.danasys.user.request.BusinessProfileRequest;
import com.danasys.user.request.DelegationRequest;
import com.danasys.user.request.ResetPasswordRequest;
import com.danasys.user.request.UpdateBusinessProfileRequest;
import com.danasys.user.request.UpdateUserRolesRequest;
import com.danasys.user.request.UserPasswordRequest;
import com.danasys.user.request.UserProfileUpdateRequest;
import com.danasys.user.request.UserServiceAreaRequest;
import com.danasys.user.response.ManagerDto;
import com.danasys.user.response.UserAddresses;
import com.danasys.user.response.UserServiceArea;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;


@RestController
@RequestMapping
@Tag(name = "User management ", description = "APIs For user management")
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

	@PostMapping(value = "/api/user/createUserBusinessProfile", consumes = "multipart/form-data")
	@Operation(summary = "Create user Business profile", description = "Create user Business profile.")
	public ResponseEntity<?> createUserBusinessProfile(
			@RequestPart("userBusinessProfile") BusinessProfileRequest createBusinessProfileRequest,
			@RequestPart(value = "file", required = false) MultipartFile file) {
		return ResponseEntity.ok("Business profile created sucessfully for user.");

	}

	@PostMapping(value = "/api/user/updateUserBusinessProfile", consumes = "multipart/form-data")
	public ResponseEntity<?> updateUserBusinessProfile(
			@RequestPart("userBusinessProfile") UpdateBusinessProfileRequest updateBusinessProfileRequest,
			@RequestPart(value = "file", required = false) MultipartFile file) {
		return ResponseEntity.ok("Business profile created sucessfully for user.");

	}

	@PutMapping("/api/user/removeUserBusinessProfile/{id}")
	@Operation(summary = "Update user Business profile", description = "Update user Business profile.")
	public ResponseEntity<?> removeUserBusinessProfile(@PathVariable Long id) {
		return ResponseEntity.ok("Business profile removed sucessfully for user.");

	}
	
	@GetMapping("/api/user/loadUserBusinessProfile")
	@Operation(summary = "load all user addresses", description = "load all user addresses.")
	public ResponseEntity<?> loadUserBusinessProfile(@RequestParam("userName") String userName) throws IOException {
		List<UserBusinessProfileDTO> userBusinessProfiles = new ArrayList();
		UserBusinessProfileDTO userBusinessProfile = new UserBusinessProfileDTO();
		userBusinessProfile.setId(1l);
		userBusinessProfile.setOwnerName("Sri Ram");
		userBusinessProfile.setStoreName("Sri Ram Store");
		userBusinessProfile.setBusinessLogoPath(
				ServletUriComponentsBuilder.fromCurrentContextPath().path("/api/product/images/userdata/").path("logo.png")
						.toUriString());
		ProductCategoryDTO productCategory = new ProductCategoryDTO();
		productCategory.setId(1l);
		productCategory.setCategoryName(ProductCategoryEnum.Grocery);
		
		userBusinessProfile.setCategory(productCategory);
		List<AddressDTO> userAddressList = new ArrayList();
		AddressDTO address1 = new AddressDTO();
		address1.setId(11l);
		address1.setFullAddress("E2 702");
		ServiceAreaDTO serviceArea = new ServiceAreaDTO();
		serviceArea.setId(1l);
		serviceArea.setFullAddress("Paramount Golfforeste, UPSIDC, Greater Noida, UP - 201309");
		serviceArea.setDistrict("Greater Noida");
		serviceArea.setState("UP");
		serviceArea.setPinCode(201309);
		
		address1.setServiceArea(serviceArea);
		BankAccountDTO bankAccount = new BankAccountDTO();
		bankAccount.setId(1l);
		bankAccount.setAccountHolderName("Sri Ram");
		bankAccount.setAccountNumber(123456789012l);
		bankAccount.setBankIfscCode("SBIN0001234");
		bankAccount.setBankName("State Bank of India");
		bankAccount.setBranch("Noida Sec-62");
		address1.setBankAccounts(bankAccount);
		address1.setType(com.danasys.user.enums.AddressTypeEnum.BUSINESS);
		userAddressList.add(address1);
		userBusinessProfile.setAddresses(userAddressList);
		//BP2
		UserBusinessProfileDTO userBusinessProfile2 = new UserBusinessProfileDTO();
		userBusinessProfile2.setId(2l);
		userBusinessProfile2.setOwnerName("Sri Gupta");
		userBusinessProfile2.setStoreName("Sri Gupta Store");
		userBusinessProfile2.setBusinessLogoPath(
				ServletUriComponentsBuilder.fromCurrentContextPath().path("/api/product/images/userdata/").path("logo.png")
						.toUriString());
		ProductCategoryDTO productCategory2 = new ProductCategoryDTO();
		productCategory2.setId(1l);
		productCategory2.setCategoryName(ProductCategoryEnum.Grocery);
		
		userBusinessProfile.setCategory(productCategory2);
		List<AddressDTO> userAddressList2 = new ArrayList();
		AddressDTO address2 = new AddressDTO();
		address2.setId(21l);
		address2.setFullAddress("G 402");
		ServiceAreaDTO serviceArea2 = new ServiceAreaDTO();
		serviceArea2.setId(2l);
		serviceArea2.setFullAddress("Paramount Golfforeste2, UPSIDC, Greater Noida, UP - 201309");
		serviceArea2.setDistrict("Greater Noida");
		serviceArea2.setState("UP");
		serviceArea2.setPinCode(201309);
		
		address1.setServiceArea(serviceArea2);
		BankAccountDTO bankAccount2 = new BankAccountDTO();
		bankAccount2.setId(2l);
		bankAccount2.setAccountHolderName("Sri Gupta");
		bankAccount2.setAccountNumber(123456782222l);
		bankAccount2.setBankIfscCode("HDFC0001234");
		bankAccount2.setBankName("HDFC Bank");
		bankAccount2.setBranch("Noida Sec-63");
		address2.setBankAccounts(bankAccount);
		address2.setType(com.danasys.user.enums.AddressTypeEnum.BUSINESS);
		userAddressList2.add(address2);
		userBusinessProfile2.setAddresses(userAddressList2);
		userBusinessProfiles.add(userBusinessProfile);
		userBusinessProfiles.add(userBusinessProfile2);
		return ResponseEntity.ok(userBusinessProfiles);

	}
	
	@GetMapping("/api/user/searchUser")
	@Operation(summary = "perform user search", description = "perform user search.")
	public ResponseEntity<?> searchUser(@RequestParam String userEmail, @RequestParam String contactNumber) {
		UserProfileDTO userProfile = new UserProfileDTO();
		userProfile.setId(1l);
		userProfile.setFullname("Sri Ram");
		userProfile.setEmail("ram@gmail.com");

		return ResponseEntity.ok(userProfile);
	}
	
	@PostMapping("/api/admin/assignDelegationRole")
	@Operation(summary = "User assign delegation to any user", description = "User delegate role to an existing user")
	public ResponseEntity<?> assignDelegationRole(@RequestBody DelegationRequest request) {
		String status = "Delegation assigned to user successfully.";
		return ResponseEntity.ok(status);
	}
	
	@GetMapping("/api/admin/getAllDeactivedUsers")
	@Operation(summary = "Load all deactivated Users", description = "API for admin to view all deactivated users.")
	public ResponseEntity<?> getAllDeactivedUsers() {
		List<UserProfileDTO> users = new ArrayList<>();
		UserProfileDTO userProfile = new UserProfileDTO();
		userProfile.setId(1l);
		userProfile.setFullname("Sri Ram");
		userProfile.setEmail("ram@gmail.com");
		userProfile.setStatus(StatusEnum.OBSOLETE);
		
		UserProfileDTO userProfile2 = new UserProfileDTO();
		userProfile2.setId(2l);
		userProfile2.setFullname("Sri Shyam");
		userProfile2.setEmail("shyam@gmail.com");
		userProfile2.setStatus(StatusEnum.OBSOLETE);
		
		UserProfileDTO userProfile3 = new UserProfileDTO();
		userProfile3.setId(3l);
		userProfile3.setFullname("Sri Shankar");
		userProfile3.setEmail("shankar@gmail.com");
		userProfile3.setStatus(StatusEnum.OBSOLETE);
		users.add(userProfile);
		users.add(userProfile2);
		users.add(userProfile3);
		return ResponseEntity.ok(users);
		
	}
	@GetMapping("/api/user/getUserMangers")
	@Operation(summary = "load user manager", description = "load user manager.")
	public ResponseEntity<?> loadUserManagers() {
		ManagerDto userManager = new ManagerDto();
		userManager.setId(1L);
		userManager.setFullname("Amit");
		userManager.setContactInfo("123456");
		userManager.setEmail("amit.danasys@gmail.com");
		return ResponseEntity.ok(userManager);

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
		
		String qrCode = ServletUriComponentsBuilder.fromCurrentContextPath().path("/api/product/images/userdata/").path("user5QRCode.png")
				.toUriString();
		
		userDetailsDTO.setMyQRCode(qrCode);
		
		String logo = ServletUriComponentsBuilder.fromCurrentContextPath().path("/api/product/images/userdata/").path("COST2COST_Red.png")
		.toUriString();
		userDetailsDTO.setCompanyLogo(logo);
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
		
		String ic1 = ServletUriComponentsBuilder.fromCurrentContextPath().path("/api/product/images/userdata/").path("bu_businessprofile.png")
				.toUriString();
		String ic2 = ServletUriComponentsBuilder.fromCurrentContextPath().path("/api/product/images/userdata/").path("bu_products.png")
				.toUriString();
		String ic3 = ServletUriComponentsBuilder.fromCurrentContextPath().path("/api/product/images/userdata/").path("bu_orders.png")
				.toUriString();
		String ic4 = ServletUriComponentsBuilder.fromCurrentContextPath().path("/api/product/images/userdata/").path("bu_moneytransfer.png")
				.toUriString();
		String ic5 = ServletUriComponentsBuilder.fromCurrentContextPath().path("/api/product/images/userdata/").path("bu_reports.png")
				.toUriString();
		String ic6 = ServletUriComponentsBuilder.fromCurrentContextPath().path("/api/product/images/userdata/").path("bu_companyprofile.png")
				.toUriString();
		String ic7 = ServletUriComponentsBuilder.fromCurrentContextPath().path("/api/product/images/userdata/").path("bu_trending.png")
				.toUriString();
		String ic8 = ServletUriComponentsBuilder.fromCurrentContextPath().path("/api/product/images/userdata/").path("bu_annualreport.png")
				.toUriString();
		String ic9 = ServletUriComponentsBuilder.fromCurrentContextPath().path("/api/product/images/userdata/").path("bu_activation.png")
				.toUriString();
		String ic10 = ServletUriComponentsBuilder.fromCurrentContextPath().path("/api/product/images/userdata/").path("bu_communication.png")
				.toUriString();
		
		String ic11 = ServletUriComponentsBuilder.fromCurrentContextPath().path("/api/product/images/userdata/").path("bu_users.png")
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
		
		BusinessDashboaardFunctionalityDTO icone11 = new BusinessDashboaardFunctionalityDTO();
		icone11.setBuIconPath(ic11);
		icone11.setName("Users");
		
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
		buIconDetails.add(icone11);
		
		
		buDashboard.setBuIconDetails(buIconDetails);
		buDashboard.setUserBusinessProfileDTOList(userBusinessProfileDTOList);
		return ResponseEntity.ok(buDashboard);

	}
	
	@PostMapping(value = "/createUserBusinessProfile")
	public ResponseEntity<?> createUserBusinessProfile(@RequestBody BusinessProfileRequest createBusinessProfileRequest) {
		
		
		return ResponseEntity.ok("SUCCESS: Business profile created sucessfully");
	}
	
	@GetMapping("/myConnections/{userProfileId}")
	@Operation(summary = "User connections", description = "User connections")
	public ResponseEntity<?> myConnections(@PathVariable Long userProfileId) {
		UserConnection connection = new UserConnection();
		
		String imageUrl = ServletUriComponentsBuilder.fromCurrentContextPath().path("/api/product/images/userdata/").path("user.png")
				.toUriString();

		String logo = ServletUriComponentsBuilder.fromCurrentContextPath().path("/api/product/images/userdata/").path("user.png")
				.toUriString();

		String name="Rajesh Gupta";
		String nameChild1="Tejas Shah";
		String nameCHild2="SP Mishra";
		if(userProfileId==2) {
			 name="Tejas Shah";
			 nameChild1="Lalit Singh";
			 nameCHild2="Hari ram";
		}
		
		connection.setClearedPoint(150d);
		connection.setUnclearedPoint(220d);
		connection.setProfileImagePath(imageUrl);
		connection.setDisplayName(name);
		connection.setTotalConnection(2);
		connection.setCompanyLogo(logo);
		List<UserConnection> connections = new ArrayList<>();
		
		UserConnection connectionChild = new UserConnection();
		connectionChild.setClearedPoint(102d);
		connectionChild.setUnclearedPoint(540d);
		connectionChild.setDisplayName(nameChild1);
		connectionChild.setProfileImagePath(imageUrl);
		connectionChild.setTotalConnection(2);
		
		UserConnection connectionChild1 = new UserConnection();
		connectionChild1.setClearedPoint(202d);
		connectionChild1.setUnclearedPoint(840d);
		connectionChild1.setDisplayName(nameCHild2);
		connectionChild1.setProfileImagePath(imageUrl);
		connection.setTotalConnection(2);

		
		connections.add(connectionChild);
		connections.add(connectionChild1);
		
		connection.setChild(connections);
		return ResponseEntity.ok(connection);

	}
	
	//Admin APIS
	

	//Service Area Operations
	@PutMapping("/api/admin/approveServiceArea/{id}/approve")
	public ResponseEntity<?> approveServiceArea(@PathVariable Long id, @PathVariable boolean isApprove) {
		return ResponseEntity.ok("service area approved successfully");
	}
	
	@PostMapping("/api/admin/updateServiceArea")
	public ResponseEntity<?> updateServiceArea(@RequestBody ServiceAreaDTO serviceArea) {
		return ResponseEntity.ok("service area updated successfully");
	}
	
	@PutMapping("/api/admin/removeServiceArea/{id}/remove")
	public ResponseEntity<?> removeServiceArea(@PathVariable Long id) {
		return ResponseEntity.ok("service area removed successfully");
	}
	
	@GetMapping("/api/admin/allRegisteredServiceAreas")
	@Operation(summary = "Load all service Areas", description = "API for admin to view all register service areas.")
	public ResponseEntity<List<ServiceAreaDTO>> getAllRegisteredServiceArea() {
		List<ServiceAreaDTO> serviceAreas = new ArrayList<>();
		ServiceAreaDTO userServiceAreaItem1 = new ServiceAreaDTO();
		userServiceAreaItem1.setId(1l);
		userServiceAreaItem1.setFullAddress("PG2");
		userServiceAreaItem1.setDistrict("Greater Noida");
		userServiceAreaItem1.setState("UP");
		userServiceAreaItem1.setPinCode(201309);
		userServiceAreaItem1.setStatus(StatusEnum.ACTIVE);
		ServiceAreaDTO userServiceAreaItem2 = new ServiceAreaDTO();
		userServiceAreaItem2.setId(2l);
		userServiceAreaItem2.setFullAddress("Paramount Golfforeste, UPSIDC");
		userServiceAreaItem2.setDistrict("Greater Noida");
		userServiceAreaItem2.setState("UP");
		userServiceAreaItem2.setPinCode(201309);
		userServiceAreaItem2.setStatus(StatusEnum.ACTIVE);
		ServiceAreaDTO userServiceAreaItem3 = new ServiceAreaDTO();
		userServiceAreaItem3.setId(3l);
		userServiceAreaItem3.setFullAddress("SUper Tech");
		userServiceAreaItem3.setDistrict("Greater Noida");
		userServiceAreaItem3.setState("UP");
		userServiceAreaItem3.setPinCode(201309);
		userServiceAreaItem3.setStatus(StatusEnum.ACTIVE);
		
		serviceAreas.add(userServiceAreaItem1);
		serviceAreas.add(userServiceAreaItem2);
		serviceAreas.add(userServiceAreaItem3);
		return ResponseEntity.ok(serviceAreas);
	}
	
// Product Category Operations
	@PutMapping("/api/admin/approveCategory/{id}/approve")
	public ResponseEntity<?> approveNewCategory(@PathVariable Long id, @PathVariable boolean isApprove) {
		return ResponseEntity.ok("Product category approved successfully");
	}
	
	@PostMapping("/api/admin/updateCategory")
	public ResponseEntity<?> updateCategory(@RequestBody ProductCategoryDTO productCategory) {
		return ResponseEntity.ok("Product category updated successfully");
	}
	
	@PutMapping("/api/admin/removeCategory/{id}/remove")
	public ResponseEntity<?> removeCategory(@PathVariable Long id) {
		return ResponseEntity.ok("Product category removed successfully");
	}
		
	@GetMapping("/api/admin/allRegisteredProductCategory")
	@Operation(summary = "Load all Product Categories", description = "API for admin to view all product categories.")
	public ResponseEntity<List<ProductCategoryDTO>> getAllRegisteredProductCategory() {
		List<ProductCategoryDTO> productCategories = new ArrayList<>();
		ProductCategoryDTO productCategory = new ProductCategoryDTO();
		productCategory.setCategoryName(ProductCategoryEnum.Grocery);
		ProductCategoryDTO productCategory1 = new ProductCategoryDTO();
		productCategory1.setCategoryName(ProductCategoryEnum.Electronics);
		ProductCategoryDTO productCategory2 = new ProductCategoryDTO();
		productCategory2.setCategoryName(ProductCategoryEnum.Fashion);
		ProductCategoryDTO productCategory3 = new ProductCategoryDTO();
		productCategory3.setCategoryName(ProductCategoryEnum.OTHERS);
		ProductCategoryDTO productCategory4 = new ProductCategoryDTO();
		productCategory4.setCategoryName(ProductCategoryEnum.Vegetables);
		
		productCategories.add(productCategory);
		productCategories.add(productCategory1);
		productCategories.add(productCategory2);
		productCategories.add(productCategory3);
		productCategories.add(productCategory4);
		return ResponseEntity.ok(productCategories);
	}

	// admin User Operations
	@PutMapping("/api/admin/user/{userId}/modifyUserPermissions")
	@Operation(summary = "Admin can modify user permission", description = "API for admin to add or remove role from user")
	public ResponseEntity<?> modifyUserPermissions(@PathVariable Long userId,
			@RequestBody UpdateUserRolesRequest request) {
		return ResponseEntity.ok("User permisson assigned successfully");
	}
	
	@PutMapping("/api/admin/user/{userId}/activateUser")
	@Operation(summary = "API for admin to Activate user", description = "API for admin to Activate user")
	public ResponseEntity<?> activateUser(@PathVariable Long userId, @PathVariable boolean isApprove) {
		return ResponseEntity.ok("User activated successfully");
	}
	
	@PutMapping("/api/admin/user/{userId}/deActivateUser")
	@Operation(summary = "API for admin to deActivate user", description = "API for admin to deActivate user")
	public ResponseEntity<?> deActivateUser(@PathVariable Long userId) {
		return ResponseEntity.ok("User deactivated successfully");
	}
	
	@PutMapping("/api/admin/user/{userId}/removeUser")
	@Operation(summary = "Admin can remove user", description = "API for admin to remove user")
	public ResponseEntity<?> removeUser(@PathVariable Long userId) {
		return ResponseEntity.ok("User Removed successfully");
	}


	@Operation(summary = "Upload Service Area CSV", description = "API for admin to upload service area details from a CSV file")
	@PostMapping(value = "/api/admin/uploadSericeAreaCsv", consumes = "multipart/form-data")
	public ResponseEntity<?> uploadSericeAreaCsv(@RequestPart("file") MultipartFile file) {
		return ResponseEntity.ok("Uploaded Service Area: " + 10 + " | Skipped (duplicates): " + 2);
		
	}
	

	
}
