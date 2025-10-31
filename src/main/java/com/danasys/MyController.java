package com.danasys;

import java.io.File;
import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.security.Principal;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

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
import com.danasys.dto.UserBusinessProfileManagerDTO;
import com.danasys.dto.UserConnection;
import com.danasys.dto.UserDetailsDTO;
import com.danasys.dto.UserProfileDTO;
import com.danasys.user.enums.OrdarStatusEnum;
import com.danasys.user.enums.UserRoleEnum;
import com.danasys.user.request.BusinessProfileRequest;
import com.danasys.user.request.DelegationRequest;
import com.danasys.user.request.ResetPasswordRequest;
import com.danasys.user.request.UpdateBusinessProfileRequest;
import com.danasys.user.request.UpdateUserRolesRequest;
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
@Tag(name = "User management ", description = "APIs For user management")
public class MyController {

	@Value("${file.upload-dir}")
	private String uploadDir;

	@Value("${file.access-url}")
	private String accessUrl;

	Map<String, UserDetailsDTO> loginUser = new HashMap<>();
	private static String loginUserName = null;

	@PostMapping("/public/login")
	@Operation(summary = "Authenticate user", description = "Using user credential authenticate user")
	public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {

		if (List.of("admin@dana.com", "gupta@dana.com", "banasal@dana.com", "user@dana.com","new@dana.com")
				.contains(loginRequest.getEmail())) {
			UserDetailsDTO userDetailsDTO = loadUser(loginRequest.getEmail());
			loginUser.put(loginRequest.getEmail(), userDetailsDTO);
			loginUserName = loginRequest.getEmail();
			return ResponseEntity.ok().body("Login successful");
		}

		return ResponseEntity.badRequest().body("Login failed");
	}

	private UserDetailsDTO loadUser(String userName) {

		UserDetailsDTO userDetailsDTO = new UserDetailsDTO();
		List<UserRoleEnum> roles = new ArrayList<>();
		userDetailsDTO.setStatus(StatusEnum.ACTIVE);
		
		if (userName.equals("admin@dana.com")) {
			userDetailsDTO.setEmail("admin@dana.com");
			userDetailsDTO.setFullname("Sri Admin");
			roles.add(UserRoleEnum.ROLE_SUPERADMIN);
			
			userDetailsDTO.setUserProfileId(1l);
			
		} else if (userName.equals("gupta@dana.com")) {
			userDetailsDTO.setEmail("gupta@dana.com");
			userDetailsDTO.setFullname("Ramesh Gupta shopkeeper");
			roles.add(UserRoleEnum.ROLE_BUSINESS_USER);
			roles.add(UserRoleEnum.ROLE_USER);
			userDetailsDTO.setUserProfileId(2l);
		} else if (userName.equals("banasal@dana.com")) {
			userDetailsDTO.setEmail("banasal@dana.com");
			userDetailsDTO.setFullname("Vikas Bansal shopkeeper");
			roles.add(UserRoleEnum.ROLE_BUSINESS_USER);
			userDetailsDTO.setUserProfileId(3l);
		} else if (userName.equals("user@dana.com")) {
			userDetailsDTO.setEmail("user@dana.com");
			userDetailsDTO.setFullname("Shopping user");
			roles.add(UserRoleEnum.ROLE_USER);
			userDetailsDTO.setUserProfileId(4l);
		}else if (userName.equals("new@dana.com")) {
			userDetailsDTO.setEmail("new@dana.com");
			userDetailsDTO.setFullname("Shopping user");
			roles.add(UserRoleEnum.ROLE_USER);
			userDetailsDTO.setUserProfileId(5l);
			userDetailsDTO.setStatus(StatusEnum.UNDER_REVIEW);
		}

		userDetailsDTO.setContactInfo("+91-91111111122");
		userDetailsDTO.setUserWalletBalance(480d);
		userDetailsDTO.setServiceAreaId(1l);
		userDetailsDTO.setHouseNo("House no-102");
		userDetailsDTO.setFullAddress("House No-102, Pocket-5, Noida Sec-62, UP-201301");

		userDetailsDTO.setRoles(roles);

		String imageUrl = ServletUriComponentsBuilder.fromCurrentContextPath().path("/api/product/images/userdata/")
				.path("user.png").toUriString();

		userDetailsDTO.setUserProfilePicture(imageUrl);
		List<String> dealOfTheDayImages = new ArrayList<>();

		String imageUrl2 = ServletUriComponentsBuilder.fromCurrentContextPath().path("/api/product/images/userdata/")
				.path("add1.png").toUriString();

		String imageUrl3 = ServletUriComponentsBuilder.fromCurrentContextPath().path("/api/product/images/userdata/")
				.path("add2.png").toUriString();

		dealOfTheDayImages.add(imageUrl2);
		dealOfTheDayImages.add(imageUrl3);
		dealOfTheDayImages.add(imageUrl2);
		dealOfTheDayImages.add(imageUrl3);
		dealOfTheDayImages.add(imageUrl2);
		dealOfTheDayImages.add(imageUrl3);
		userDetailsDTO.setDealOfTheDayImages(dealOfTheDayImages);

		String greeting = ServletUriComponentsBuilder.fromCurrentContextPath().path("/api/product/images/userdata/")
				.path("g_main.png").toUriString();

		userDetailsDTO.setGreetingOfTheDay(greeting);

		String wallet = ServletUriComponentsBuilder.fromCurrentContextPath().path("/api/product/images/userdata/")
				.path("wallet.png").toUriString();

		userDetailsDTO.setUserWalletImage(wallet);

		String qrCode = ServletUriComponentsBuilder.fromCurrentContextPath().path("/api/product/images/userdata/")
				.path("user5QRCode.png").toUriString();

		userDetailsDTO.setMyQRCode(qrCode);

		String logo = ServletUriComponentsBuilder.fromCurrentContextPath().path("/api/product/images/userdata/")
				.path("cost2cost-new.png").toUriString();
		userDetailsDTO.setCompanyLogo(logo);
		userDetailsDTO.setBusinessUserOneTimePayment(101d);
		return userDetailsDTO;
	}
	
	@GetMapping("/api/user/productCategoryList/{serviceArea}")
	@Operation(summary = "Product category list", description = "All listed product category")
	public List<ProductCategorySADetailsDTO> findAllCategoryByServiceArea(@PathVariable Long serviceArea) {

		if (serviceArea != null && serviceArea > 0) {
			List<ProductCategorySADetailsDTO> productCategoryDTOList = new ArrayList<>();

			ProductCategorySADetailsDTO cat1 = new ProductCategorySADetailsDTO();
			cat1.setId(1l);
			cat1.setCategoryName(ProductCategoryEnum.Grocery);
			String imageUrl1 = ServletUriComponentsBuilder.fromCurrentContextPath()
					.path("/api/product/images/category/").path("grocery.png").toUriString();
			cat1.setImage(imageUrl1);
			cat1.setTheemColorCode("#FFFF00");
			
			String g_main = ServletUriComponentsBuilder.fromCurrentContextPath().path("/api/product/images/userdata/")
					.path("g_main.png").toUriString();
			String g_add1 = ServletUriComponentsBuilder.fromCurrentContextPath().path("/api/product/images/userdata/")
					.path("g_add1.png").toUriString();

			String g_add2 = ServletUriComponentsBuilder.fromCurrentContextPath().path("/api/product/images/userdata/")
					.path("g_add2.png").toUriString();
			String g_add3 = ServletUriComponentsBuilder.fromCurrentContextPath().path("/api/product/images/userdata/")
					.path("g_add3.png").toUriString();

			String g_add4 = ServletUriComponentsBuilder.fromCurrentContextPath().path("/api/product/images/userdata/")
					.path("g_add4.jpg").toUriString();
			
			cat1.setGreetingOfTheDay(g_main);
			cat1.getDealOfTheDayImages().add(g_add1);
			cat1.getDealOfTheDayImages().add(g_add2);
			cat1.getDealOfTheDayImages().add(g_add3);
			cat1.getDealOfTheDayImages().add(g_add4);

			
			
			String guptaStore = ServletUriComponentsBuilder.fromCurrentContextPath()
					.path("/api/product/images/userdata/").path("gupta_store.jpg").toUriString();
			BusinessProfileDetailsDTO b1 = new BusinessProfileDetailsDTO();
			b1.setId(1l);
			b1.setBusinessLogoPath(guptaStore);
			b1.setStoreName("Gupta Ji General Store");

			String bansalStore = ServletUriComponentsBuilder.fromCurrentContextPath()
					.path("/api/product/images/userdata/").path("bansal_store.png").toUriString();
			BusinessProfileDetailsDTO b2 = new BusinessProfileDetailsDTO();
			b2.setId(2l);
			b2.setBusinessLogoPath(bansalStore);
			b2.setStoreName("Bansal Ji General Store");

			List<BusinessProfileDetailsDTO> bList = new ArrayList<>();
			bList.add(b2);
			bList.add(b1);
			cat1.setLinkedBusinessProfile(bList);

			// CAT 2
			ProductCategorySADetailsDTO cat2 = new ProductCategorySADetailsDTO();
			cat2.setId(2l);
			cat2.setCategoryName(ProductCategoryEnum.Vegetables);
			String imageUrl2 = ServletUriComponentsBuilder.fromCurrentContextPath()
					.path("/api/product/images/category/").path("vegetable.png").toUriString();
			cat2.setImage(imageUrl2);
			cat2.setTheemColorCode("#228B22");
			
			
			String v_main = ServletUriComponentsBuilder.fromCurrentContextPath().path("/api/product/images/userdata/")
					.path("v_main.png").toUriString();
			String v_add1 = ServletUriComponentsBuilder.fromCurrentContextPath().path("/api/product/images/userdata/")
					.path("add1.png").toUriString();

			String v_add2 = ServletUriComponentsBuilder.fromCurrentContextPath().path("/api/product/images/userdata/")
					.path("add2.png").toUriString();
			
			cat2.getDealOfTheDayImages().add(v_add1);
			cat2.getDealOfTheDayImages().add(v_add2);
			cat2.setGreetingOfTheDay(v_main);

			BusinessProfileDetailsDTO b3 = new BusinessProfileDetailsDTO();
			b3.setId(3l);
			b3.setBusinessLogoPath(imageUrl2);
			b3.setStoreName("Ramu vegetable Store");
			List<BusinessProfileDetailsDTO> bList2 = new ArrayList<>();
			bList2.add(b3);
			cat2.setLinkedBusinessProfile(bList2);
			
			String rauSabji = ServletUriComponentsBuilder.fromCurrentContextPath()
					.path("/api/product/images/userdata/").path("ramu.png").toUriString();
			BusinessProfileDetailsDTO b4 = new BusinessProfileDetailsDTO();
			b4.setId(4l);
			b4.setBusinessLogoPath(rauSabji);
			b4.setStoreName("Ramu Sabji wala");

			String shyamuSabji = ServletUriComponentsBuilder.fromCurrentContextPath()
					.path("/api/product/images/userdata/").path("bansal_store.png").toUriString();
			BusinessProfileDetailsDTO b5 = new BusinessProfileDetailsDTO();
			b5.setId(5l);
			b5.setBusinessLogoPath(shyamuSabji);
			b5.setStoreName("Shaym Vegitable Store");
			
			String hariOm = ServletUriComponentsBuilder.fromCurrentContextPath()
					.path("/api/product/images/userdata/").path("gupta_store.jpg").toUriString();
			BusinessProfileDetailsDTO b6 = new BusinessProfileDetailsDTO();
			b6.setId(6l);
			b6.setBusinessLogoPath(hariOm);
			b6.setStoreName("Hari Om Vegitable and Fruit Corner");
			
			String mandiFresh = ServletUriComponentsBuilder.fromCurrentContextPath()
					.path("/api/product/images/userdata/").path("mandi.jpg").toUriString();
			BusinessProfileDetailsDTO b7 = new BusinessProfileDetailsDTO();
			b7.setId(7l);
			b7.setBusinessLogoPath(mandiFresh);
			b7.setStoreName("Mandi Fresh Vegitables");

			String wholeSale = ServletUriComponentsBuilder.fromCurrentContextPath()
					.path("/api/product/images/userdata/").path("whole.png").toUriString();
			BusinessProfileDetailsDTO b8 = new BusinessProfileDetailsDTO();
			b8.setId(8l);
			b8.setBusinessLogoPath(wholeSale);
			b8.setStoreName("WholeSale vegitable store");

			List<BusinessProfileDetailsDTO> vegiList = new ArrayList<>();
			vegiList.add(b3);
			vegiList.add(b4);
			vegiList.add(b5);
			vegiList.add(b6);
			vegiList.add(b7);
			vegiList.add(b8);
			
			
			cat2.setLinkedBusinessProfile(vegiList);
			

			// CAT 3
			ProductCategorySADetailsDTO cat3 = new ProductCategorySADetailsDTO();
			cat3.setId(3l);
			cat3.setCategoryName(ProductCategoryEnum.Fashion);
			String imageUrl3 = ServletUriComponentsBuilder.fromCurrentContextPath()
					.path("/api/product/images/category/").path("fashion.png").toUriString();
			cat3.setImage(imageUrl3);
			cat3.setTheemColorCode("#B22222");

			BusinessProfileDetailsDTO b12 = new BusinessProfileDetailsDTO();
			b12.setId(12l);
			b12.setBusinessLogoPath(imageUrl3);
			b12.setStoreName("Ramu vegetable Store");
			List<BusinessProfileDetailsDTO> bList3 = new ArrayList<>();
			bList3.add(b12);
			cat3.setLinkedBusinessProfile(bList3);

			// CAT 4
			ProductCategorySADetailsDTO cat4 = new ProductCategorySADetailsDTO();
			cat4.setId(4l);
			cat4.setCategoryName(ProductCategoryEnum.Electronics);
			String imageUrl4 = ServletUriComponentsBuilder.fromCurrentContextPath()
					.path("/api/product/images/category/").path("electronics.png").toUriString();
			cat4.setImage(imageUrl4);
			cat4.setTheemColorCode("#228B22");

			// CAT 5
			ProductCategorySADetailsDTO cat5 = new ProductCategorySADetailsDTO();
			cat5.setId(5l);
			cat5.setCategoryName(ProductCategoryEnum.RonyRocket);
			String imageUrl5 = ServletUriComponentsBuilder.fromCurrentContextPath()
					.path("/api/product/images/category/").path("ronyrocket.png").toUriString();
			cat5.setImage(imageUrl5);
			cat5.setTheemColorCode("#228B22");

			// NEW CATEGORY

			ProductCategorySADetailsDTO cat6 = new ProductCategorySADetailsDTO();
			cat6.setId(6l);
			cat6.setCategoryName(ProductCategoryEnum.Beauty);
			String imageUrl6 = ServletUriComponentsBuilder.fromCurrentContextPath()
					.path("/api/product/images/category/").path("beauty.png").toUriString();
			cat6.setImage(imageUrl6);
			cat6.setTheemColorCode("#228B22");

			// CAT 7
			ProductCategorySADetailsDTO cat7 = new ProductCategorySADetailsDTO();
			cat7.setId(7l);
			cat7.setCategoryName(ProductCategoryEnum.Appointment);
			String imageUrl7 = ServletUriComponentsBuilder.fromCurrentContextPath()
					.path("/api/product/images/category/").path("appointment.png").toUriString();
			cat7.setImage(imageUrl7);
			cat7.setTheemColorCode("#228B22");

			// CAT 8
			ProductCategorySADetailsDTO cat8 = new ProductCategorySADetailsDTO();
			cat8.setId(8l);
			cat8.setCategoryName(ProductCategoryEnum.Carservice);
			String imageUrl8 = ServletUriComponentsBuilder.fromCurrentContextPath()
					.path("/api/product/images/category/").path("carservice.png").toUriString();
			cat8.setImage(imageUrl8);
			cat8.setTheemColorCode("#228B22");

			// CAT 9
			ProductCategorySADetailsDTO cat9 = new ProductCategorySADetailsDTO();
			cat9.setId(9l);
			cat9.setCategoryName(ProductCategoryEnum.Gift);
			String imageUrl9 = ServletUriComponentsBuilder.fromCurrentContextPath()
					.path("/api/product/images/category/").path("gift&stationery.png").toUriString();
			cat9.setImage(imageUrl9);
			cat9.setTheemColorCode("#228B22");

			// CAT 10
			ProductCategorySADetailsDTO cat10 = new ProductCategorySADetailsDTO();
			cat10.setId(10l);
			cat10.setCategoryName(ProductCategoryEnum.Gym);
			String imageUrl10 = ServletUriComponentsBuilder.fromCurrentContextPath()
					.path("/api/product/images/category/").path("gym&fitness.png").toUriString();
			cat10.setImage(imageUrl10);
			cat10.setTheemColorCode("#228B22");

			// CAT 11
			ProductCategorySADetailsDTO cat11 = new ProductCategorySADetailsDTO();
			cat11.setId(11l);
			cat11.setCategoryName(ProductCategoryEnum.HomeDecor);
			String imageUrl11 = ServletUriComponentsBuilder.fromCurrentContextPath()
					.path("/api/product/images/category/").path("homedecor.png").toUriString();
			cat11.setImage(imageUrl11);
			cat11.setTheemColorCode("#228B22");

			// CAT 12
			ProductCategorySADetailsDTO cat12 = new ProductCategorySADetailsDTO();
			cat12.setId(12l);
			cat12.setCategoryName(ProductCategoryEnum.Pharmacy);
			String imageUrl12 = ServletUriComponentsBuilder.fromCurrentContextPath()
					.path("/api/product/images/category/").path("pharmacy.png").toUriString();
			cat12.setImage(imageUrl12);
			cat12.setTheemColorCode("#228B22");

			// CAT 13
			ProductCategorySADetailsDTO cat13 = new ProductCategorySADetailsDTO();
			cat13.setId(13l);
			cat13.setCategoryName(ProductCategoryEnum.Pooja);
			String imageUrl13 = ServletUriComponentsBuilder.fromCurrentContextPath()
					.path("/api/product/images/category/").path("poojapath.png").toUriString();
			cat13.setImage(imageUrl13);
			cat13.setTheemColorCode("#228B22");

			// CAT 14
			ProductCategorySADetailsDTO cat14 = new ProductCategorySADetailsDTO();
			cat14.setId(14l);
			cat14.setCategoryName(ProductCategoryEnum.Print);
			String imageUrl14 = ServletUriComponentsBuilder.fromCurrentContextPath()
					.path("/api/product/images/category/").path("printsolution.png").toUriString();
			cat14.setImage(imageUrl14);
			cat14.setTheemColorCode("#228B22");

			// CAT 15
			ProductCategorySADetailsDTO cat15 = new ProductCategorySADetailsDTO();
			cat15.setId(15l);
			cat15.setCategoryName(ProductCategoryEnum.Restorent);
			String imageUrl15 = ServletUriComponentsBuilder.fromCurrentContextPath()
					.path("/api/product/images/category/").path("restaurant.png").toUriString();
			cat15.setImage(imageUrl15);
			cat15.setTheemColorCode("#B22222");
			

			
			
			productCategoryDTOList.add(cat1);
			productCategoryDTOList.add(cat2);
			productCategoryDTOList.add(cat3);
			productCategoryDTOList.add(cat4);
			productCategoryDTOList.add(cat5);

			productCategoryDTOList.add(cat6);
			productCategoryDTOList.add(cat7);
			productCategoryDTOList.add(cat8);
			productCategoryDTOList.add(cat9);
			productCategoryDTOList.add(cat10);

			productCategoryDTOList.add(cat11);
			productCategoryDTOList.add(cat12);
			productCategoryDTOList.add(cat13);
			productCategoryDTOList.add(cat14);
			productCategoryDTOList.add(cat15);
			return productCategoryDTOList;
		}

		return null;

	}

	@PostMapping("/public/loginM")
	@Operation(summary = "Authenticate user", description = "Using user credential authenticate user")
	public ResponseEntity<?> loginUsingMobile(@RequestBody LoginMobileRequest loginRequest) {
		return ResponseEntity.ok().body("Login successful");

	}

	// User Registration API - start
	@PostMapping("/public/registerUser")
	public ResponseEntity<?> registerUser(@RequestBody RegisterUserRequest userDto) {
		return ResponseEntity.ok(
				"User Registered and select your service Area and Update your profile. Please check your email for your ReferalCode.");
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
	// User Registration API - start

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

	@PutMapping("/api/user/setUserDefaultAddress/{id}")
	@Operation(summary = "Set selected address as user deafult address", description = "Set selected address as user deafult address.")
	public ResponseEntity<?> setUserDefaultAddresses(@PathVariable Long id) throws IOException {
		return ResponseEntity.ok("User address status updated as default.");
	}

	@PutMapping("/api/user/removeUserAddress/{id}")
	@Operation(summary = "Remove selected address", description = "Remove selected address")
	public ResponseEntity<?> removeUserAddress(@PathVariable Long id) throws IOException {
		return ResponseEntity.ok("User address removed.");
	}

	@PostMapping(value = "/api/user/updateUserPassword")
	@Operation(summary = "Change user password", description = "Change user password.")
	public ResponseEntity<?> updateUserPassword(@RequestBody UserPasswordRequest userPasswordRequest) {
		return ResponseEntity.ok("SUCCESS: Password changed successfully");
	}

	@PostMapping(value = "/api/user/updateUserProfile", consumes = "multipart/form-data")
	@Operation(summary = "update user profile", description = "Update user prfofile.")
	public ResponseEntity<?> updateUserProfile(@RequestPart("user") UserProfileUpdateRequest user, // JSON blob part
			@RequestPart(value = "file", required = false) MultipartFile file) {
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

		if (userName.equals(loginUserName) && loginUser.get(userName) != null
				&& loginUser.get(userName).getRoles().contains(UserRoleEnum.ROLE_BUSINESS_USER)) {
			List<UserBusinessProfileDTO> userBusinessProfiles = new ArrayList();
			UserBusinessProfileDTO userBusinessProfile = new UserBusinessProfileDTO();

			if (userName.equals("gupta@dana.com")) {
				userBusinessProfile.setId(10l);
				userBusinessProfile.setOwnerName("Sri Ramesh Gupta");
				userBusinessProfile.setStoreName("Sri Ram Store");
			} else {
				userBusinessProfile.setId(20l);
				userBusinessProfile.setOwnerName("Sri Vikas Bansal");
				userBusinessProfile.setStoreName("Sri Vikas Store");
			}

			userBusinessProfile.setBusinessLogoPath(ServletUriComponentsBuilder.fromCurrentContextPath()
					.path("/api/product/images/userdata/").path("logo.png").toUriString());
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
			
			address1.setType(com.danasys.user.enums.AddressTypeEnum.BUSINESS);
			userAddressList.add(address1);
			userBusinessProfile.setAddresses(userAddressList);
			BankAccountDTO bankAccount = new BankAccountDTO();
			bankAccount.setId(1l);
			bankAccount.setAccountHolderName("Sri Ram");
			bankAccount.setAccountNumber(123456789012l);
			bankAccount.setBankIfscCode("SBIN0001234");
			bankAccount.setBankName("State Bank of India");
			bankAccount.setBranch("Noida Sec-62");
			userBusinessProfile.setBankAccount(bankAccount);
			
			// BP2
			UserBusinessProfileDTO userBusinessProfile2 = new UserBusinessProfileDTO();
			userBusinessProfile2.setId(30l);
			userBusinessProfile2.setOwnerName("Sri Gupta");
			userBusinessProfile2.setStoreName("Sri Gupta Store");
			userBusinessProfile2.setBusinessLogoPath(ServletUriComponentsBuilder.fromCurrentContextPath()
					.path("/api/product/images/userdata/").path("logo.png").toUriString());
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
			
			address2.setType(com.danasys.user.enums.AddressTypeEnum.BUSINESS);
			userAddressList2.add(address2);
			userBusinessProfile2.setAddresses(userAddressList2);
			BankAccountDTO bankAccount2 = new BankAccountDTO();
			bankAccount2.setId(2l);
			bankAccount2.setAccountHolderName("Sri Gupta");
			bankAccount2.setAccountNumber(123456782222l);
			bankAccount2.setBankIfscCode("HDFC0001234");
			bankAccount2.setBankName("HDFC Bank");
			bankAccount2.setBranch("Noida Sec-63");
			userBusinessProfile2.setBankAccount(bankAccount);
			
			userBusinessProfiles.add(userBusinessProfile);
			userBusinessProfiles.add(userBusinessProfile2);
			return ResponseEntity.ok(userBusinessProfiles);
		}
		return ResponseEntity.badRequest().body("username is incorrect !!");

	}

	@GetMapping("/api/user/searchUser")
	@Operation(summary = "perform user search", description = "perform user search.")
	public ResponseEntity<?> searchUser(@RequestParam(name = "userEmail", required = false) String userEmail,
			@RequestParam(name = "contactNumber", required = false) String contactNumber) {
		UserProfileDTO userProfile = new UserProfileDTO();
		userProfile.setId(1l);
		userProfile.setFullname("Sri Ram");
		userProfile.setEmail("ram@gmail.com");
		userProfile.setStatus(StatusEnum.ACTIVE);
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

	@GetMapping("/api/user/getUserBusinessProfileMangers/{userProfileId}")
	@Operation(summary = "load user manager", description = "load user manager.")
	public ResponseEntity<?> getUserMangers(@RequestParam("userProfileId") Long userProfileIdl) {
		List<UserBusinessProfileManagerDTO> userManagers = new ArrayList();
		UserBusinessProfileManagerDTO userManager = new UserBusinessProfileManagerDTO();
		userManager.setId(1L);
		userManager.setFullname("Amit");
		userManager.setUserProfilePicture(ServletUriComponentsBuilder.fromCurrentContextPath()
				.path("/api/product/images/userdata/").path("logo.png").toUriString());
		userManager.setContactInfo("123456");
		userManager.setStoreName("Amit Store");
		
		UserBusinessProfileManagerDTO userManager2 = new UserBusinessProfileManagerDTO();
		userManager2.setId(2L);
		userManager2.setFullname("SP");
		userManager2.setUserProfilePicture(ServletUriComponentsBuilder.fromCurrentContextPath()
				.path("/api/product/images/userdata/").path("logo.png").toUriString());
		userManager2.setContactInfo("1234567");
		userManager2.setStoreName("SP Store");

		userManagers.add(userManager);
		userManagers.add(userManager2);
		return ResponseEntity.ok(userManagers);

	}

	@GetMapping("/api/user/getManagedUserBusinessProfiles/{userProfileId}")
	@Operation(summary = "load usersBusiness Profile managed by user", description = "load usersBusiness Profile managed by user")
	public ResponseEntity<?> getManagedUserBusinessProfiles(@RequestParam("userProfileId") Long userProfileIdl) {

		if (loginUser.get(loginUserName).getUserProfileId().longValue() == userProfileIdl) {

			List<UserBusinessProfileDTO> managedUsers = new ArrayList<>();
			UserBusinessProfileDTO userbp1 = new UserBusinessProfileDTO();
			userbp1.setId(1L);
			userbp1.setStoreName("Sundari Store");
			userbp1.setOwnerName("Sundari");
			userbp1.setBusinessLogoPath(ServletUriComponentsBuilder.fromCurrentContextPath()
					.path("/api/product/images/userdata/").path("logo.png").toUriString());
			ProductCategoryDTO productCategory1 = new ProductCategoryDTO();
			productCategory1.setId(1l);
			productCategory1.setCategoryName(ProductCategoryEnum.Fashion);
			userbp1.setCategory(productCategory1);

			UserBusinessProfileDTO userbp2 = new UserBusinessProfileDTO();
			userbp2.setId(2L);
			userbp2.setStoreName("Katya Store");
			userbp2.setOwnerName("Katya");
			userbp2.setBusinessLogoPath(ServletUriComponentsBuilder.fromCurrentContextPath()
					.path("/api/product/images/userdata/").path("logo.png").toUriString());
			ProductCategoryDTO productCategory2 = new ProductCategoryDTO();
			productCategory2.setId(1l);
			productCategory2.setCategoryName(ProductCategoryEnum.Grocery);
			userbp2.setCategory(productCategory2);

			managedUsers.add(userbp1);
			managedUsers.add(userbp2);
			return ResponseEntity.ok(managedUsers);
		}
		return ResponseEntity.badRequest().body("wrong profile id");

	}
	// user Info API end --

	@GetMapping("/api/user/getUserDetails")
	@Operation(summary = "Get user details", description = "API for get user details")
	public UserDetailsDTO getUserDetails() {
		return loginUser.get(loginUserName);
	}

	@GetMapping("/api/user/serviceAreaList")
	@Operation(summary = "load all service area Areas", description = "load all service area Areas.")
	public ServiceAreaDetails serviceAreaList() {

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

		return details;

	}

	@GetMapping("/api/product/productList")
	@Operation(summary = "Product list", description = "Provide list of product for registered user")
	public List<ProductDTO> productList() throws IOException {

		List<ProductDTO> prodicts = getAllOtherProducts(1l);

		return prodicts;

	}

	@GetMapping("/public/loginTheem")
	@Operation(summary = "Login theem", description = "Login theem APIr")
	public LoginTheemDTO loginTheem() throws IOException {

		LoginTheemDTO theem = new LoginTheemDTO();
		String backGroundImage = ServletUriComponentsBuilder.fromCurrentContextPath()
				.path("/api/product/images/userdata/").path("9.jpg").toUriString();

		String companyLogo = ServletUriComponentsBuilder.fromCurrentContextPath().path("/api/product/images/userdata/")
				.path("cost2cost-new.png").toUriString();

		theem.setBackGroundImageURL(backGroundImage);
		theem.setCompanyLogo(companyLogo);

		return theem;

	}

	

	public List<ProductDTO> getAllOtherProducts(Long userProfileId) throws IOException {
		PathMatchingResourcePatternResolver resolver = new PathMatchingResourcePatternResolver();
		// Resource[] resources = resolver.getResources("classpath:static/grocery/*.*");
		List<ProductDTO> products = new ArrayList();
		Long id = 100000l;
		populateDefaultProduct(userProfileId, products, id, ProductCategoryEnum.Grocery.name());

		// resources = resolver.getResources("classpath:static/vegetables/*.*");
		id = 200000l;
		populateDefaultProduct(userProfileId, products, id, ProductCategoryEnum.Vegetables.name());

		// resources = resolver.getResources("classpath:static/fashion/*.*");
		id = 300000l;
		populateDefaultProduct(userProfileId, products, id, ProductCategoryEnum.Fashion.name());

		// resources = resolver.getResources("classpath:static/ronyrocket/*.*");
		id = 400000l;
		populateDefaultProduct(userProfileId, products, id, ProductCategoryEnum.RonyRocket.name());

		// resources = resolver.getResources("classpath:static/electronics/*.*");
		id = 500000l;
		populateDefaultProduct(userProfileId, products, id, ProductCategoryEnum.Electronics.name());

		return products;
	}

	private void populateDefaultProduct(Long userProfileId, List<ProductDTO> products, Long id, String category) {

		if (loginUser.get(loginUserName).getUserProfileId().longValue() >0) {

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
					if(fileName.contains("Fortune")) {
						product.setQuantity(0);
					}else if(fileName.contains("Tata")) {
						product.setQuantity(5);
					}else {
						product.setQuantity(10);
					}
					
					product.setDescription("good product");
					product.setUserBusinessProfileId(userProfileId);
					product.setId(id);
					product.setStarRating(4.5);

					products.add(product);

				}
			}
		}
	}

	@GetMapping({ "/api/product/images/grocery/{filename:.+}", "/api/product/images/vegetables/{filename:.+}",
			"/api/product/images/fashion/{filename:.+}", "/api/product/images/electronics/{filename:.+}",
			"/api/product/images/ronyrocket/{filename:.+}", "/api/product/images/category/{filename:.+}",
			"/api/product/images/userdata/{filename:.+}" })
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
		} else if (requestURI.contains("images/vegetables")) {
			newUploadDir = uploadDir + "vegetables/";
		} else if (requestURI.contains("images/fashion")) {
			newUploadDir = uploadDir + "fashion/";
		} else if (requestURI.contains("images/electronics")) {
			newUploadDir = uploadDir + "electronics/";
		} else if (requestURI.contains("images/ronyrocket")) {
			newUploadDir = uploadDir + "ronyrocket/";
		} else if (requestURI.contains("images/category")) {
			newUploadDir = uploadDir + "category/";
		} else if (requestURI.contains("images/userdata")) {
			newUploadDir = uploadDir + "userdata\\";
		}

		Path imagePath = Paths.get(newUploadDir).resolve(filename);
		Resource resource = new UrlResource(imagePath.toUri());

		if (!resource.exists()) {
			return (Resource) ResponseEntity.notFound().build();
		}
		return resource;
	}

	@GetMapping("/api/user/loadBusinessDashboard/{userProfileId}")
	public ResponseEntity<?> loadBusinessUserDashboard(@PathVariable Long userProfileId) {

		if (loginUser.get(loginUserName).getUserProfileId() == userProfileId) {

			UserBusinessDashboardDTO buDashboard = new UserBusinessDashboardDTO();

			List<UserBusinessProfileDTO> userBusinessProfileDTOList = new ArrayList<>();
			UserBusinessProfileDTO bp = new UserBusinessProfileDTO();

			String imageUrl = ServletUriComponentsBuilder.fromCurrentContextPath().path("/api/product/images/userdata/")
					.path("guptastore.png").toUriString();
			bp.setId(1l);
			bp.setBusinessLogoPath(imageUrl);
			bp.setOwnerName("Ramesh Gupta");
			bp.setStoreName("Gupta general Store");

			String imageUrl1 = ServletUriComponentsBuilder.fromCurrentContextPath()
					.path("/api/product/images/userdata/").path("guptaveg.png").toUriString();

			UserBusinessProfileDTO bp1 = new UserBusinessProfileDTO();
			bp1.setBusinessLogoPath(imageUrl1);
			bp1.setOwnerName("Ramesh Gupta");
			bp1.setStoreName("Gupta Vegitable SHOP");
			bp1.setId(2l);

			userBusinessProfileDTOList.add(bp);
			userBusinessProfileDTOList.add(bp1);

			List<BusinessDashboaardFunctionalityDTO> buIconDetails = new ArrayList<>();

			String ic0 = ServletUriComponentsBuilder.fromCurrentContextPath().path("/api/product/images/userdata/")
					.path("bu_dashboard.png").toUriString();
			String ic1 = ServletUriComponentsBuilder.fromCurrentContextPath().path("/api/product/images/userdata/")
					.path("bu_businessprofile.png").toUriString();
			String ic2 = ServletUriComponentsBuilder.fromCurrentContextPath().path("/api/product/images/userdata/")
					.path("bu_products.png").toUriString();
			String ic3 = ServletUriComponentsBuilder.fromCurrentContextPath().path("/api/product/images/userdata/")
					.path("bu_orders.png").toUriString();
			String ic4 = ServletUriComponentsBuilder.fromCurrentContextPath().path("/api/product/images/userdata/")
					.path("admin_transfer.png").toUriString();
			String ic5 = ServletUriComponentsBuilder.fromCurrentContextPath().path("/api/product/images/userdata/")
					.path("bu_reports.png").toUriString();
			String ic6 = ServletUriComponentsBuilder.fromCurrentContextPath().path("/api/product/images/userdata/")
					.path("bu_companyprofile.png").toUriString();
			String ic7 = ServletUriComponentsBuilder.fromCurrentContextPath().path("/api/product/images/userdata/")
					.path("bu_trending.png").toUriString();
			String ic8 = ServletUriComponentsBuilder.fromCurrentContextPath().path("/api/product/images/userdata/")
					.path("bu_annualreport.png").toUriString();
			String ic9 = ServletUriComponentsBuilder.fromCurrentContextPath().path("/api/product/images/userdata/")
					.path("bu_activation.png").toUriString();
			String ic10 = ServletUriComponentsBuilder.fromCurrentContextPath().path("/api/product/images/userdata/")
					.path("bu_communication.png").toUriString();
			String ic11 = ServletUriComponentsBuilder.fromCurrentContextPath().path("/api/product/images/userdata/")
					.path("bu_users.png").toUriString();
			
			
			String ic12 = ServletUriComponentsBuilder.fromCurrentContextPath().path("/api/product/images/userdata/")
					.path("bu_payments.png").toUriString();


			BusinessDashboaardFunctionalityDTO icone0 = new BusinessDashboaardFunctionalityDTO();
			icone0.setBuIconPath(ic0);
			icone0.setName("Dashboard");
			
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
			
			BusinessDashboaardFunctionalityDTO icone12 = new BusinessDashboaardFunctionalityDTO();
			icone12.setBuIconPath(ic12);
			icone12.setName("Transfer");

			buIconDetails.add(icone0);
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
			buIconDetails.add(icone12);
			

			buDashboard.setBuIconDetails(buIconDetails);
			buDashboard.setUserBusinessProfileDTOList(userBusinessProfileDTOList);
			Set<UserRoleEnum> roles = new HashSet<>();
			roles.add(UserRoleEnum.ROLE_BUSINESS_USER);
			roles.add(UserRoleEnum.ROLE_USER);
			roles.add(UserRoleEnum.ROLE_SUPERADMIN);
			buDashboard.setRoles(roles);
			
			Set<StatusEnum> statusList = new HashSet<>();
			statusList.add(StatusEnum.ACTIVE);
			statusList.add(StatusEnum.OBSOLETE);
			statusList.add(StatusEnum.UNDER_REVIEW);
			buDashboard.setStatus(statusList);

			buDashboard.setColorTheam("#87CEEB");

			Set<com.danasys.user.enums.OrdarStatusEnum> orderStatus = new HashSet<>();
			orderStatus.add(OrdarStatusEnum.DELIVERED);
			orderStatus.add(OrdarStatusEnum.OUT_OF_STOCK);
			orderStatus.add(OrdarStatusEnum.CANCELLED);
			orderStatus.add(OrdarStatusEnum.REPLACEMENT);
			buDashboard.setOrderStatus(orderStatus);

			return ResponseEntity.ok(buDashboard);
		}
		return ResponseEntity.badRequest().body("Wrong user profile id");

	}

	@GetMapping("/api/order/myConnections/{userProfileId}")
	@Operation(summary = "User connections", description = "User connections")
	public ResponseEntity<?> myConnections(@PathVariable Long userProfileId) {
		
		if ( userProfileId>2) 
		{
			
	
		UserConnection connection = new UserConnection();

		String imageUrl = ServletUriComponentsBuilder.fromCurrentContextPath().path("/api/product/images/userdata/")
				.path("user.png").toUriString();

		String logo = ServletUriComponentsBuilder.fromCurrentContextPath().path("/api/product/images/userdata/")
				.path("user.png").toUriString();

		String name = "Rajesh Gupta";
		String nameChild1 = "Tejas Shah";
		String nameCHild2 = "SP Mishra";
		if (userProfileId == 2) {
			name = "Tejas Shah";
			nameChild1 = "Lalit Singh";
			nameCHild2 = "Hari ram";
		}
		connection.setUserProfileId(userProfileId);
		connection.setClearedPoint(150d);
		connection.setUnclearedPoint(220d);
		connection.setProfileImagePath(imageUrl);
		connection.setDisplayName(name);
		connection.setTotalConnection(2);
		connection.setCompanyLogo(logo);
		connection.setParentId(3l);
		
		List<UserConnection> connections = new ArrayList<>();

		UserConnection connectionChild = new UserConnection();
		connectionChild.setClearedPoint(102d);
		connectionChild.setUnclearedPoint(540d);
		connectionChild.setDisplayName(nameChild1);
		connectionChild.setProfileImagePath(imageUrl);
		connectionChild.setTotalConnection(2);
		connectionChild.setUserProfileId(2l);

		UserConnection connectionChild1 = new UserConnection();
		connectionChild1.setClearedPoint(202d);
		connectionChild1.setUnclearedPoint(840d);
		connectionChild1.setDisplayName(nameCHild2);
		connectionChild1.setProfileImagePath(imageUrl);
		connectionChild1.setUserProfileId(4l);
		connection.setTotalConnection(2);

		connections.add(connectionChild);
		connections.add(connectionChild1);
		
		List<UserConnection> connectionsC1 = new ArrayList<>();
		UserConnection connectionChild2 = new UserConnection();
		connectionChild2.setClearedPoint(202d);
		connectionChild2.setUnclearedPoint(840d);
		connectionChild2.setDisplayName(nameCHild2);
		connectionChild2.setProfileImagePath(imageUrl);
		connectionChild2.setUserProfileId(4l);
		connection.setTotalConnection(2);
		connectionsC1.add(connectionChild2);
		connectionChild1.setChild(connectionsC1);
		

		connection.setChild(connections);
		return ResponseEntity.ok(connection);
		
		}else {

			UserConnection connection = new UserConnection();

			String imageUrl = ServletUriComponentsBuilder.fromCurrentContextPath().path("/api/product/images/userdata/")
					.path("user.png").toUriString();

			String logo = ServletUriComponentsBuilder.fromCurrentContextPath().path("/api/product/images/userdata/")
					.path("user.png").toUriString();

			String name = "Changed User";
			String nameChild1 = "Ram Singh";
			String nameCHild2 = "New User Mishra";
			if (userProfileId == 2) {
				name = "Changed Shah";
				nameChild1 = "Name Singh";
				nameCHild2 = "Jai hanuman ram";
			}
			connection.setUserProfileId(userProfileId);
			connection.setClearedPoint(150d);
			connection.setUnclearedPoint(220d);
			connection.setProfileImagePath(imageUrl);
			connection.setDisplayName(name);
			connection.setTotalConnection(2);
			connection.setCompanyLogo(logo);
			connection.setParentId(3l);
			List<UserConnection> connections = new ArrayList<>();

			UserConnection connectionChild = new UserConnection();
			connectionChild.setClearedPoint(102d);
			connectionChild.setUnclearedPoint(540d);
			connectionChild.setDisplayName(nameChild1);
			connectionChild.setProfileImagePath(imageUrl);
			connectionChild.setTotalConnection(2);
			connectionChild.setUserProfileId(2l);

			UserConnection connectionChild1 = new UserConnection();
			connectionChild1.setClearedPoint(202d);
			connectionChild1.setUnclearedPoint(840d);
			connectionChild1.setDisplayName(nameCHild2);
			connectionChild1.setProfileImagePath(imageUrl);
			connectionChild1.setUserProfileId(4l);
			connection.setTotalConnection(2);

			connections.add(connectionChild);
			connections.add(connectionChild1);

			connection.setChild(connections);
			return ResponseEntity.ok(connection);
		}

		
	}

	// Admin APIS

	// Service Area Operations
	@PutMapping("/api/admin/approveServiceArea/{id}/approve")
	public ResponseEntity<?> approveServiceArea(@PathVariable Long id, @RequestParam boolean isApprove) {
		if (isApprove) {
			return ResponseEntity.ok("service area Activated successfully");
		} else {
			return ResponseEntity.ok("service area Deactivated successfully");
		}

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
	public ResponseEntity<?> approveNewCategory(@PathVariable Long id, @RequestParam boolean isApprove) {
		if (isApprove) {
			return ResponseEntity.ok("Product category Activated successfully");
		} else {
			return ResponseEntity.ok("Product category Deactivated successfully");
		}

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
		productCategory.setId(1l);
		productCategory.setCategoryName(ProductCategoryEnum.Grocery);
		ProductCategoryDTO productCategory1 = new ProductCategoryDTO();
		productCategory1.setId(2l);
		productCategory1.setCategoryName(ProductCategoryEnum.Electronics);
		ProductCategoryDTO productCategory2 = new ProductCategoryDTO();
		productCategory2.setId(3l);
		productCategory2.setCategoryName(ProductCategoryEnum.Fashion);
		ProductCategoryDTO productCategory3 = new ProductCategoryDTO();
		productCategory3.setId(4l);
		productCategory3.setCategoryName(ProductCategoryEnum.Carservice);
		ProductCategoryDTO productCategory4 = new ProductCategoryDTO();
		productCategory4.setId(5l);
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

	@GetMapping("/api/user/loadUserBusinessProfileById")
	public ResponseEntity<?> loadUserBusinessProfileById(@RequestParam("userProfileId") Long userProfileId)
			throws IOException {

		if (loginUser.get(loginUserName).getUserProfileId().longValue() == userProfileId) {
		List<UserBusinessProfileDTO> userBusinessProfiles = new ArrayList();
		UserBusinessProfileDTO userBusinessProfile = new UserBusinessProfileDTO();
		userBusinessProfile.setId(11l);
		userBusinessProfile.setOwnerName("Sri Ram");
		userBusinessProfile.setStoreName("Sri Ram Store");
		userBusinessProfile.setBusinessLogoPath(ServletUriComponentsBuilder.fromCurrentContextPath()
				.path("/api/product/images/userdata/").path("logo.png").toUriString());
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
		
		address1.setType(com.danasys.user.enums.AddressTypeEnum.BUSINESS);
		userAddressList.add(address1);
		userBusinessProfile.setAddresses(userAddressList);
		BankAccountDTO bankAccount = new BankAccountDTO();
		bankAccount.setId(1l);
		bankAccount.setAccountHolderName("Sri Ram");
		bankAccount.setAccountNumber(123456789012l);
		bankAccount.setBankIfscCode("SBIN0001234");
		bankAccount.setBankName("State Bank of India");
		bankAccount.setBranch("Noida Sec-62");
		userBusinessProfile.setBankAccount(bankAccount);
		
		// BP2
		UserBusinessProfileDTO userBusinessProfile2 = new UserBusinessProfileDTO();
		userBusinessProfile2.setId(22l);
		userBusinessProfile2.setOwnerName("Sri Gupta");
		userBusinessProfile2.setStoreName("Sri Gupta Store");
		userBusinessProfile2.setBusinessLogoPath(ServletUriComponentsBuilder.fromCurrentContextPath()
				.path("/api/product/images/userdata/").path("logo.png").toUriString());
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
		
		address2.setType(com.danasys.user.enums.AddressTypeEnum.BUSINESS);
		userAddressList2.add(address2);
		userBusinessProfile2.setAddresses(userAddressList2);
		BankAccountDTO bankAccount2 = new BankAccountDTO();
		bankAccount2.setId(2l);
		bankAccount2.setAccountHolderName("Sri Gupta");
		bankAccount2.setAccountNumber(123456782222l);
		bankAccount2.setBankIfscCode("HDFC0001234");
		bankAccount2.setBankName("HDFC Bank");
		bankAccount2.setBranch("Noida Sec-63");
		userBusinessProfile2.setBankAccount(bankAccount2);
		userBusinessProfiles.add(userBusinessProfile);
		userBusinessProfiles.add(userBusinessProfile2);

		return ResponseEntity.ok(userBusinessProfiles);
		}
		
		return ResponseEntity.badRequest().body("Wrong user profile id");

	}
	
	@PutMapping("/api/user/removeBusinessManager/{userProfileId}")
	@Operation(summary = "Remove business manager", description = "Set selected address as user deafult address.")
	public ResponseEntity<?> removeBusinessManager(@PathVariable Long userProfileId)
			throws IOException {
		String status = "Business manager removed successfully";
		return ResponseEntity.ok(status);
	}
	
	@PutMapping("/api/user/noMoreManagerOfBusiness/{userProfileId}")
	@Operation(summary = "Remove business manager", description = "Set selected address as user deafult address.")
	public ResponseEntity<?> noMoreManagerOfBusiness(@PathVariable Long userProfileId)
			throws IOException {
		String status = "Business manager removed successfully";
		return ResponseEntity.ok(status);
	}

}
