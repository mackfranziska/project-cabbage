import { Test, TestingModule } from '@nestjs/testing';
import { RolandBarthesController } from './roland-barthes.controller';
import { RolandBarthesService } from '../services/roland-barthes.service';
import { S3Service } from '../../../shared/s3/s3.service';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { AskHimRequest, AskHimResponse } from '../models/roland-barthes.models';

describe('RolandBarthesController', () => {
  let controller: RolandBarthesController;

  const rolandService = {
    askHim: jest.fn(),
  };
  const s3Service = {
    uploadFile: jest.fn(),
  };

  const logger = {
    error: jest.fn(),
    info: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RolandBarthesController],
      providers: [
        {
          provide: RolandBarthesService,
          useValue: rolandService,
        },
        {
          provide: S3Service,
          useValue: s3Service,
        },
        {
          provide: WINSTON_MODULE_PROVIDER,
          useValue: logger,
        },
      ],
    }).compile();

    controller = module.get<RolandBarthesController>(RolandBarthesController);
  });

  beforeEach(() => {
    rolandService.askHim.mockClear();
    s3Service.uploadFile.mockClear();
  });

  const request: AskHimRequest = {
    input: 'Test, 1 2 3',
    name: 'Sohee',
  };
  const response: AskHimResponse = { output: 'It is me, Roland!' };

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('askHim', () => {
    it('should call askRoland method of RolandBarthesService and save to S3', async () => {
      rolandService.askHim.mockImplementationOnce((req) => {
        expect(req).toMatchObject(request);
        return response;
      });

      const result = await controller.askRoland(request);

      expect(result).toMatchObject(response);
      expect(s3Service.uploadFile).toHaveBeenCalled();
    });

    // TODO: test errors
  });
});
